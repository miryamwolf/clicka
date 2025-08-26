import { Request, Response, NextFunction } from 'express';
import * as CalendarService from '../services/googleCalendarBookingIntegration.service ';
import type { ID, UpdateGoogleCalendarEventRequest } from 'shared-types';

export const getGoogleCalendarEvents = async (req: Request, res: Response) => {
    try {
        const calendarId: string = req.params.calendarId;
        const token: string = req.params.token;
        const events = await CalendarService.getGoogleCalendarEvents(calendarId, token);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
        res.status(500).json({ message: 'Failed to fetch Google Calendar events', error: error });
    }
}

export const createCalendarEvent = async (req: Request, res: Response, next: NextFunction) => {
       console.log(req.body, "req ");
        console.log("find the token in body ",req.body.headers.Authorization, "find the token in body ");
    const token = extractToken(req.body);
    console.log("Token in createCalendarEvent:", token);
    
      if (!token) return next({ status: 401, message: 'Missing token' });
      const { calendarId } = req.params;
      console.log("Booking in createCalendarEvent:", req.body.body.booking);
      const  booking = req.body.body.booking;
      console.log("Booking in createCalendarEvent:", booking);
      try {
        // validateEventInput(event); // ← כאן תופסת שגיאות לפני כל שליחה
        const createdEvent = await CalendarService.createCalendarEvent(calendarId, booking,token);
        res.status(201).json(createdEvent);
      } catch (err: any) {
        if (!err.status) err.status = 500;
        next(err);
      }
 
}


export async function getAllCalendarSync(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);
      if (!token) return next({ status: 401, message: 'Missing token' });
        const calendarId: string = req.params.calendarId;
    try {
        const result = await CalendarService.getGoogleCalendarEvents(calendarId, token);
        res.json(result)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}
export async function getCalendarSyncById(req: Request, res: Response) {
    const syncId: string = req.params.id;
    const result = await CalendarService.getCalendarSyncById(syncId);
    if (result) {
        res.status(200).json(result);
    }
    else {
        res.status(404).json({ error: 'Calendar sync not found' });
    }
}
// export const createCalendarEvent = async (req: Request, res: Response) => {
//     try {
//         const { calendarId, event, token, booking } = req.body;
//         const syncStatus = await CalendarService.createCalendarEvent(event, calendarId, token, booking);
//         res.status(200).json({ status: syncStatus });
//     } catch (error) {
//         console.error('Error creating calendar event:', error);
//         res.status(500).json({ message: 'Failed to create calendar event', error: error });
//     }
// }

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const updateDetails = req.body;
        await CalendarService.deleteEnevt(updateDetails);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Failed to delete event', error: error });
    }
}
export const deleteCalendarSyncByEventId = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await CalendarService.deleteCalendarSync(id);
    res.status(200).json({ message: 'Calendar sync deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar sync by event ID:', error);
    res.status(500).json({ message: 'Failed to delete calendar sync', error });
  }
};

export const updateEventOnChangeBooking = async (req: Request, res: Response) => {
    try {
        const updateDetails: UpdateGoogleCalendarEventRequest = req.body;
        await CalendarService.updateEnevtOnChangeBooking(updateDetails);
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event on change booking:', error);
        res.status(500).json({ message: 'Failed to update event on change booking', error: error });
    }
}


export const deleteCalendarSync = async (req: Request, res: Response) => {
  try {
    await CalendarService.deleteCalendarSync(req.params.id);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCalendarByRoom = async (req: Request, res: Response) => {
    try {
        const roomId: ID = req.params.roomId;
        // const calendar = await CalendarService.getCalendarByRoom(roomId);
        // if (calendar) {
        //     res.status(200).json(calendar);
        // } else {
        //     res.status(404).json({ message: 'Calendar not found for the specified room' });
        // }
    } catch (error) {
        console.error('Error getting calendar by room:', error);
        res.status(500).json({ message: 'Failed to get calendar by room', error: error });
    }
}

export const manageCalendarPermissions = async (req: Request, res: Response) => {
  try {
    const { calendarId, email, role } = req.body;
    await CalendarService.manageCalendarPermissions(calendarId, email, role);
    res.status(200).json({ message: 'Calendar permissions managed successfully' });
  } catch (error) {
    console.error('Error managing calendar permissions:', error);
    res.status(500).json({ message: 'Failed to manage calendar permissions', error });
  }
};

export const shareCalendar = async (req: Request, res: Response) => {
    try {
        const { calendarId, email } = req.body;
        await CalendarService.shareCalendar(calendarId, email);
        res.status(200).json({ message: 'Calendar shared successfully' });
    } catch (error) {
        console.error('Error sharing calendar:', error);
        res.status(500).json({ message: 'Failed to share calendar', error: error });
    }
}
export const handleGoogleCalendarWebhook = async (req: Request, res: Response) => {
  try {
    const headers = req.headers;

    await CalendarService.processCalendarWebhook(headers);

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Error processing webhook");
  }
};
function extractToken(req: Request): string | null {
  const auth = req.headers.Authorization;
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.split(' ')[1];
  }
  return null;
}
// function extractToken(req: Request): string | null {
//   const auth = req.headers.Authorization;
//   console.log(auth);
  
//   return "";
// //   return auth?.startsWith('Bearer ') ? auth.split(' ')[1] : null;
// }