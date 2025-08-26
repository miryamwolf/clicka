import { CalendarEventInput } from 'shared-types/google';

/**
 * Validates event input.
 * Throws an error with appropriate HTTP status:
 * - 400: Missing or malformed input
 * - 422: Invalid but well-formed values
 * - 403: Forbidden business logic
 */
export function validateEventInput(event: CalendarEventInput) {
  // 400 – שדות חובה חסרים
  if (!event) {
    throw { status: 400, message: 'Missing event payload' };
  }
  if (!event.summary) {
    throw { status: 400, message: 'Missing summary' };
  }
  if (!event.start) {
    throw { status: 400, message: 'Missing start' };
  }
  if (!event.end) {
    throw { status: 400, message: 'Missing end' };
  }

  // תאריך התחלה/סיום (עם תמיכה ב־date או dateTime)
  const startDate = event.start.dateTime ?? (event.start as any).date;
  const endDate = event.end.dateTime ?? (event.end as any).date;
  if (!startDate) {
    throw { status: 400, message: 'Missing start date/dateTime' };
  }
  if (!endDate) {
    throw { status: 400, message: 'Missing end date/dateTime' };
  }

  // 422 – פורמטים לא תקינים או תוכן לא הגיוני
  if (isNaN(Date.parse(startDate))) {
    throw { status: 422, message: 'Invalid start date format' };
  }
  if (isNaN(Date.parse(endDate))) {
    throw { status: 422, message: 'Invalid end date format' };
  }
  if (new Date(endDate) <= new Date(startDate)) {
    throw { status: 422, message: 'End must be after start' };
  }
  if (event.summary.length > 100) {
    throw { status: 422, message: 'Summary too long (max 100 characters)' };
  }
  if (event.description && event.description.length > 1000) {
    throw { status: 422, message: 'Description too long (max 1000 characters)' };
  }
  if (event.attendees) {
    if (!Array.isArray(event.attendees)) {
      throw { status: 400, message: 'Attendees must be an array' };
    }
    for (const attendee of event.attendees) {
      if (!attendee.email) {
        throw { status: 422, message: 'Each attendee must include an email' };
      }
    }
  }

  // 403 – כללים עסקיים (דוגמה: שדה פנימי שאסור להשתמש בו)
  if ((event as any).internalOnly === true) {
    throw { status: 403, message: 'You do not have permission to create internal-only events' };
  }
}
