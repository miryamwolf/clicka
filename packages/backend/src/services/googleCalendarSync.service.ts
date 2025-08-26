import { google } from 'googleapis';
import { UserTokenService } from './userTokenService';

export async function watchGoogleCalendar(calendarId: string, webhookUrl: string, accessToken: string | null) {
  const { OAuth2 } = google.auth;
  const oAuth2Client = new OAuth2();
  oAuth2Client.setCredentials({ access_token: accessToken });
  
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  
  const res = await calendar.events.watch({
    calendarId,
    requestBody: {
      id: 'clicka-calendar-1',
      type: 'web_hook',
      address: webhookUrl,
    },
  });
  return res.data;
}
export async function renewGoogleWebhook() {
const userTokenService = new UserTokenService();
  const calendarId = 'primary';
  const accessToken = await userTokenService.getSystemAccessToken();
  const webhookUrl = "https://clicka-app-stage.onrender.com/api/google-calendar/webhook"!;
  console.log('accessToken:', accessToken);
  await watchGoogleCalendar(calendarId, webhookUrl, accessToken);
  console.log('Google Calendar webhook renewed!');
}