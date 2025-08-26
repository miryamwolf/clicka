export const googleAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  redirectUri: window.location.origin,
  scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'openid',
    ],
};

