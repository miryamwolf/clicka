
import { BookingStatus, CalendarSync, type CalendarEventInput, type CreateGoogleCalendarEventRequest, type DeleteGoogleCalendarEventRequest, type GoogleCalendarEvent, type ID, type UpdateGoogleCalendarEventRequest } from "shared-types";
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { CalendarSyncModel } from "../models/calendarSync.model";
import { getEvents } from './calendar-service';
import { createEvent } from './calendar-service'
import { BookingModel } from "../models/booking.model";
import * as syncController from "../controllers/googleCalendarBookingIntegration.controller";
import { BookingService } from "./booking.service"
import { Event } from "shared-types/google";
import { google } from "googleapis";
import { toZonedTime } from "date-fns-tz";
import { BookingController } from "../controllers/booking.controller";
import { UserTokenService } from "./userTokenService";
// טוען את משתני הסביבה מקובץ .env
dotenv.config();

const bookingService = new BookingService();
const userTokenService = new UserTokenService();
const supabaseUrl = process.env.SUPABASE_URL || ''; // החלף עם ה-URL של פרויקט ה-Supabase שלך
const supabaseAnonKey = process.env.SUPABASE_KEY || ''; // החלף עם ה-Anon Key שלך
const supabase = createClient(supabaseUrl, supabaseAnonKey);
//נחמי קוזיץ getAll עבור event שליפת כל האירועים והמרת לאובייקט  
export const getGoogleCalendarEvents = async (calendarId: string, token: string): Promise<Event[] | null> => {
    const events = await getEvents(calendarId, token);

    const newEvents: Event[] = await Promise.all(events.map(async event => {
        console.log("event in the getGoogleCalendarEvents\n", event);
        console.log(event.id, "event.id in the getGoogleCalendarEvents\n");

        let booking = null;
        try {
            booking = await BookingService.getBookingByEventId(event.id!);
        } catch (error) {
            console.error('Error fetching booking:', error);
        }

        if (!booking) {
            console.warn(`⚠️ No booking found for event ID ${event.id}, skipping or applying defaults.`);
        }

        return {
            id: event.id || '',
            calendarId: calendarId,
            summary: event.summary || '',
            description: event.description || '',
            location: event.location || '',
            start: {
                dateTime: event.start?.dateTime || event.start?.date || '',
                timeZone: event.start?.timeZone || 'Asia/Jerusalem',
            },
            end: {
                dateTime: event.end?.dateTime || event.end?.date || '',
                timeZone: event.end?.timeZone || 'Asia/Jerusalem',
            },
            attendees: event.attendees?.map(attendee => ({
                email: attendee.email || '',
                displayName: attendee.displayName || '',
            })) || [],
            status: booking?.status ?? BookingStatus.PENDING, // הגנה מפני קריסה
            created: event.created || '',
            updated: event.updated || '',
            htmlLink: event.htmlLink || '',
        };
    }));

    return newEvents;
}

//יצירת אובייקט סינכרון כרגע לא רלוונטי
export const createCalendarSync = async (sync: CalendarSyncModel): Promise<CalendarSyncModel | null> => {
    const { data, error } = await supabase
        .from('calendar_sync') // שם הטבלה ב-Supabase
        // .insert([map]) // כך זה עובד?
        .insert([sync.toDatabaseFormat()])
        //לא צריך עם המרה?
        .select()
        .single();

    if (error) {
        console.error('Error creating sync:', error);
        return null;
    }

    const createdSync = CalendarSyncModel.fromDatabaseFormat(data); // המרה לסוג WorkspaceMapModel

    return createdSync;
}

//עדכון אובייקט סנכרון כרגע לא רלוונטי
export async function updateCalendarSync(id: string, updatedData: CalendarSyncModel): Promise<CalendarSyncModel | null> {

    console.log('Prepared sync data for update:', JSON.stringify(updatedData, null, 2));
    const { data, error } = await supabase
        .from('calendar_sync')
        .update([updatedData.toDatabaseFormat()])
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('Error updating sync:', error);
        return null;
    }
    const sync = CalendarSyncModel.fromDatabaseFormat(data);
    return sync;



}

//מחיקת אובייקט סנכרון כרגע לא רלוונטי ה 
export async function deleteCalendarSync(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('calendar_sync')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting sync:', error);
        return false;
    }

    return true;
}
// שליפת כל אובייקטי הסנכרון כרגע לא רלוונטי
export const gatAllCalendarSync = async (): Promise<CalendarSync[] | null> => {
    const { data, error } = await supabase
        .from('calendar_sync')
        .select('*')
    if (error) {
        console.error('Error fetching maps layout :', error);
        return null;
    }
    // const layouts = CalendarSyncModel.fromDatabaseFormatArray(data);


    return data;
}

//שליפת סנכרון לפי id כרגע לא רלוונטי`
export async function getCalendarSyncById(id: string) {
    const { data, error } = await supabase
        .from('calendar_sync')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching layout:', error);
        return null;
    }

    const layout = CalendarSyncModel.fromDatabaseFormat(data);

    return layout;
}

//המרת הזמנה לאובייקט תואם לקלנדר
export async function convertBookingToCalendarEvent(booking: BookingModel): Promise<CalendarEventInput> {
    console.log("booking in in the convert\n", booking);

    let newName = "";
    if (booking.customerName) {
        newName = booking.customerName;
    }
    else if (booking.externalUserName) {
        newName = booking.externalUserName;
    }
    return {
        summary: `פגישה עבור ${newName}`,
        description: booking.notes,
        location: booking.roomName,
        start: {
            dateTime: booking.startTime,
            timeZone: 'Asia/Jerusalem' // ניתן לשנות לפי הצורך
        },
        end: {
            dateTime: booking.endTime,
            timeZone: 'Asia/Jerusalem' // ניתן לשנות לפי הצורך
        },
        //לבדוק האם צריך להוסיף פרטים של לקוח קיים- אם משתמשים בכלל בעמודה
        attendees: booking.externalUserEmail ? [{ email: booking.externalUserEmail }] : [],
        reminders: {
            useDefault: true // או false, תלוי בצורך שלך
        }
    };
}
export const createCalendarEvent = async (calendarId: string,
    booking: BookingModel,
    token: string) => {
    // השלבים העדכניים של הפונקציה 
    //להמיר הזמנה לאירוע
    //להוסיף את האירוע בקלנדר
    //לקחת את הid שנוצר
    //ולהוסיף אותו לאובייקט המתאים במסד

    //אם ההזמנה לא מאושרת-אין אפשרות ליצור אירוע
    console.log('Booking object:', booking);
    console.log('token object:', token);
    console.log('calendarId object:', calendarId);
    console.log("booking before the convert\n", booking);
    const calendarEvent = await convertBookingToCalendarEvent(booking);
    try {
        const statusEvent = await createEvent(calendarId, calendarEvent, token);
        console.log("statusEvent\n", statusEvent);

        if (statusEvent.id != null) {
            booking.googleCalendarEventId = statusEvent.id;
        }
        console.log("booking.googleCalendarEventId", booking.googleCalendarEventId);


        //לעדכן את נאווה שחייבים לשלוח id
        if (!booking.id) {
            throw new Error('Booking ID is required to update the booking.');
        }
        console.log('Type of updatedData:', booking.constructor.name);

        console.log(booking, "booking in ??????????????????????????\n  ,", booking.id);

        const bookingModel = booking instanceof BookingModel
            ? booking
            : new BookingModel(booking);
        await BookingService.updateBooking(bookingModel.id!, bookingModel);


    } catch (error) {
        console.log("checking the type of", error);

        let errorMessage = 'An unknown error occurred'; // הודעת שגיאה ברירת מחדל

        if (error instanceof Error) {
            errorMessage = error.message; // אם error הוא אובייקט שגיאה
        } else if (typeof error === 'string') {
            errorMessage = error; // אם error הוא מחרוזת
        }


    }

}



export const deleteEnevt = async (enevt: DeleteGoogleCalendarEventRequest) => {
    // פונקציה זו תמחק אירוע.
    // לאה שארר-deleteGoogleCalendarEvent ע"י שליחה לפונקצית מחיקה
    // המתאים calendarSync ותמחק את ה 
    //deleteCalendarSyncByEventId() ע"י הפונקציה 
}



export const updateEnevtOnChangeBooking = async (updateDetails: UpdateGoogleCalendarEventRequest): Promise<void> => {
    // פונקציה זו תעדכן אירוע קיים בלוח השנה כאשר פרטי ההזמנה משתנים.
    // לאה שארר-updateGoogleCalendarEvent ע"י שליחה לפונקצית עדכון
    // המתאים calendarSync ותעדכן את ה 
    //updateCalendarSync() ע"י מציאתו בפונקציה 
}





export const manageCalendarPermissions = async (calendarId: string, email: string, role?: string): Promise<void> => {
    //Google Calendar API כדי לנהל את ההרשאות
    // לדוגמה, אפשר להשתמש ב-ACL (Access Control Lists) כדי להוסיף או לעדכן הרשאות
}

export const shareCalendar = async (calendarId: string, email: string): Promise<void> => {
    // אפשר להשתמש ב-Google Calendar API כדי לשתף את לוח השנה עם כתובת המייל
}
async function getCalendarByChannelId(channelId: string): Promise<{ calendarId: string; token: string }> {
    // ❗ החליפי בזה בביצוע למסד נתונים אמיתי
    const dummyDb: any = {
        "my-channel-id-123": {
            calendarId: process.env.CALENDAR_ID,
            token: userTokenService.getSystemAccessToken(),
        },
    };

    const data = dummyDb[channelId];
    if (!data) throw new Error("Channel ID not found");
    return data;
}

// פונקציית עזר לשליפת אירועים מלוח השנה
async function getRecentEvents(calendarId: string, token: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });
    const calendar = google.calendar({ version: "v3", auth });

    const now = new Date();
    const from = new Date(now.getTime() - 5 * 60 * 1000); // חמש דקות אחורה
    const res = await calendar.events.list({
        calendarId,
        timeMin: from.toISOString(),
        timeMax: now.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
    });

    const items = res.data.items || [];

    return items.map((event) => ({
        id: event.id,
        summary: event.summary,
        start: event.start?.dateTime,
        end: event.end?.dateTime,
    }));
}

// הפונקציה הראשית שמטפלת ב־Webhook
export async function processCalendarWebhook(headers: any): Promise<void> {
    const channelId = headers['x-goog-channel-id'];

    const calendarId = process.env.SYSTEM_EMAIL;
    const token = await userTokenService.getSystemAccessToken();

    // שלב 2 – משיכת אירועים מגוגל
    const events = await getGoogleCalendarEvents(calendarId!, token!);
    console.log(events+'*************************************************');
    if (!events || events.length === 0) {
        console.log("No events found in Google Calendar.");
        return;
    }
    for (const event of events ?? []) {
        const existing = await BookingService.getBookingByEventId(event.id!);
        if (event.status === BookingStatus.CANCELED) {
            if (existing) {
                await bookingService.deleteBooking(existing.id!);
                console.log(`🗑️ Booking deleted for cancelled event ${event.id}`);
            }
            continue;
        }

        if (existing) {
            const updated = BookingModel.fromGoogleEvent(event);
            await BookingService.updateBooking(existing?.id!, updated);
            console.log(`✏️ Booking updated for event ${event.id}`);
        } else {
            const newBooking = BookingModel.fromGoogleEvent(event);
            await bookingService.createBooking(newBooking);
            console.log(`🆕 Booking created for new event ${event.id}`);
        }
    }
}
