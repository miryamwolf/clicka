import { Request, Response, NextFunction } from 'express';
import { sendEmail, listEmails, sendEmailsInBatch } from '../services/gmail-service';
import { validateSendEmailInput } from '../utils/validateSendEmailInput';
import { validateListEmailQuery } from '../utils/validateListEmailQuery';
import { SendEmail } from '../../../shared-types/google';
import { UserTokenService } from '../services/userTokenService';

/**
 * שולח מייל אחד (עם או בלי קבצים מצורפים)
 */
export async function postEmail(req: Request, res: Response, next: NextFunction) {
  const userTokenService = new UserTokenService();
  const token = await userTokenService.getSystemAccessToken();

  if (!token) return next({ status: 401, message: 'Missing token' });

  try {
    const to = req.body.to ? ([] as string[]).concat(req.body.to) : [];
    const cc = req.body.cc ? ([] as string[]).concat(req.body.cc) : [];
    const bcc = req.body.bcc ? ([] as string[]).concat(req.body.bcc) : [];

    const subject = req.body.subject || '';
    const body = req.body.body || '';
    const isHtml = req.body.isHtml === 'true' || req.body.isHtml === true;

    const attachments =
      Array.isArray(req.files) && req.files.length > 0
        ? (req.files as Express.Multer.File[]).map((file) => ({
            filename: file.originalname,
            mimeType: file.mimetype,
            data: file.buffer,
          }))
        : [];

    const emailRequest: SendEmail = {
      to,
      cc,
      bcc,
      subject,
      body,
      isHtml,
      attachments,
    };

    validateSendEmailInput(emailRequest);

    const result = await sendEmail('me', emailRequest, token);
    res.status(200).json(result);
  } catch (err: any) {
    next({ status: err.status || 500, message: err.message || 'Unexpected error' });
  }
}

/**
 * שולח קבוצת מיילים (batch)
 */
export async function postEmailsBatch(req: Request, res: Response, next: NextFunction) {
  const userTokenService = new UserTokenService();
  const token = await userTokenService.getSystemAccessToken();

  if (!token) return next({ status: 401, message: 'Missing token' });

  try {
    const emails: SendEmail[] = req.body.emails;

    if (!Array.isArray(emails) || emails.length === 0) {
      return next({ status: 400, message: 'Missing or empty emails array' });
    }

    emails.forEach(validateSendEmailInput);

    await sendEmailsInBatch(emails, token);
    res.status(200).json({ success: true, message: 'Emails sent in batch' });
  } catch (err: any) {
    next({ status: err.status || 500, message: err.message || 'Unexpected error' });
  }
}

/**
 * מחזיר רשימת מיילים לפי פילטרים
 */
export async function getListEmails(req: Request, res: Response, next: NextFunction) {
  const userTokenService = new UserTokenService();
  const token = await userTokenService.getSystemAccessToken();

  if (!token) return next({ status: 401, message: 'Missing token' });

  try {
    validateListEmailQuery(req);

    const { maxResults, q, labelIds, pageToken } = req.query;

    const options = {
      maxResults: maxResults ? Number(maxResults) : undefined,
      q: q as string | undefined,
      labelIds: labelIds
        ? Array.isArray(labelIds)
          ? (labelIds as string[])
          : [labelIds as string]
        : undefined,
      pageToken: pageToken as string | undefined,
    };

    const result = await listEmails('me', token, options);
    res.status(200).json(result);
  } catch (err: any) {
    next({ status: err.status || 500, message: err.message || 'Unexpected error' });
  }
}

