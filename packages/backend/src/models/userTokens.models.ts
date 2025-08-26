import { DateISO, ID } from "shared-types";



export class UserTokens {
  id?: ID;
  userId: ID;
  accessToken: string;
  accessTokenExpiry: DateISO;
  refreshToken: string;
  activeSessionId: string | null = null;
  sessionCreatedAt: DateISO | null = null; // add session creation time
  lastActivityAt: DateISO | null = null;   // add last activity time
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: ID,
    userId: ID,
    accessToken: string,
    accessTokenExpiry: DateISO,
    refreshToken: string,
    createdAt: DateISO,
    updatedAt: DateISO,
    activeSessionId?: string | null,
    sessionCreatedAt?: DateISO | null,
    lastActivityAt?: DateISO | null
  ) {
    this.id = id;
    this.userId = userId;
    this.accessToken = accessToken;
    this.accessTokenExpiry = accessTokenExpiry;
    this.refreshToken = refreshToken;
    this.activeSessionId = activeSessionId || null;
    this.sessionCreatedAt = sessionCreatedAt || null;
    this.lastActivityAt = lastActivityAt || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      user_id: this.userId,
      access_token: this.accessToken,
      access_token_expiry: this.accessTokenExpiry,
      refresh_token: this.refreshToken,
      active_session_id: this.activeSessionId,
      session_created_at: this.sessionCreatedAt,
      last_activity_at: this.lastActivityAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  
}

