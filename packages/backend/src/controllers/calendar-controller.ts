import { validateEventInput } from '../utils/validateEventInput';
import { Request, Response, NextFunction } from 'express';
import * as calendarService from '../services/calendar-service';
import { CalendarEventInput, DateISO } from 'shared-types';
import { UserTokenService } from '../services/userTokenService';
// import { CalendarEventInput } from 'shared-types/google'; 
// import { DateISO } from 'shared-types/core'; 

export async function postEvent(req: Request, res: Response, next: NextFunction) {
  const userTokenService = new UserTokenService();
  const token = await userTokenService.getSystemAccessToken();
  if (!token) return next({ status: 401, message: 'Missing token' });
  const { calendarId } = req.params;
  const event: CalendarEventInput = req.body;
  try {
    validateEventInput(event); // ← כאן תופסת שגיאות לפני כל שליחה

    const createdEvent = await calendarService.createEvent(calendarId, event, token);
    res.status(201).json(createdEvent);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function getListEvents(req: Request, res: Response, next: NextFunction) {
  const userTokenService = new UserTokenService();
  const token = await userTokenService.getSystemAccessToken(); 
  if (!token) return next({ status: 401, message: 'Missing token' });
  const { calendarId } = req.params;
  try {
    const events = await calendarService.getEvents(calendarId, token);
    res.json(events);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  const userTokenService = new UserTokenService();
  const token = await userTokenService.getSystemAccessToken(); 
  if (!token) return next({ status: 401, message: 'Missing token' });
  const { calendarId, eventId } = req.params;
  try {
    await calendarService.deleteEvent(calendarId, eventId, token);
    res.sendStatus(204);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function putEvent(req: Request, res: Response, next: NextFunction) {
  const userTokenService = new UserTokenService();
  const token = await userTokenService.getSystemAccessToken(); 
  if (!token) return next({ status: 401, message: 'Missing token' });
  const { calendarId, eventId } = req.params;
  const updates: Partial<CalendarEventInput> = req.body;
  try {
    if (updates.start || updates.end) {
      validateEventInput({
        ...updates,
        start: updates.start!,
        end: updates.end!
      } as CalendarEventInput);
    }
    const updated = await calendarService.updateEvent(calendarId, eventId, updates, token);
    res.json(updated);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function getFreeBusy(req: Request, res: Response, next: NextFunction) {
  const userTokenService = new UserTokenService();
  const token = await userTokenService.getSystemAccessToken(); 
  if (!token) return next({ status: 401, message: 'Missing token' });
  const { calendarId } = req.params;
  const { start, end }: { start: DateISO, end: DateISO } = req.body;
  if (!start || !end) {
    return res.status(400).json({ success: false, error: { code: 400, message: 'Missing start/end parameter.' } });
  }
  try {
    const isFree = await calendarService.checkAvailability(calendarId, start, end, token);
    res.json({ available: isFree });
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

