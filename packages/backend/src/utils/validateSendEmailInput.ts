import { SendEmail } from 'shared-types/google';

/**
 * Validates email input and throws error with HTTP status:
 * - 400: Missing fields or invalid structure
 * - 422: Invalid values (lengths, email format, etc.)
 * - 403: Blocked operations (e.g., blacklisted addresses)
 */
export function validateSendEmailInput(data: SendEmail) {
  if (!data) {
    throw { status: 400, message: 'Missing request body' };
  }
  const { to, subject = '', body = '', attachments } = data;
  if (!to || !Array.isArray(to) || to.length === 0) {
    throw { status: 400, message: '"to" must be a non-empty array' };
  }
  if (typeof subject !== 'string') {
    throw { status: 400, message: 'Invalid subject' };
  }
  if (typeof body !== 'string') {
    throw { status: 400, message: 'Invalid body' };
  }
  if (subject.length > 200) {
    throw { status: 422, message: 'Subject too long (max 200 characters)' };
  }
  if (body.length > 10000) {
    throw { status: 422, message: 'Email body too long (max 10,000 characters)' };
  }
  const allRecipients = [...(data.to || []), ...(data.cc || []), ...(data.bcc || [])];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const email of allRecipients) {
    if (!emailRegex.test(email)) {
      throw { status: 422, message: `Invalid email address: ${email}` };
    }}
  if (allRecipients.some(e => e.endsWith('@blocked-domain.com'))) {
    throw { status: 403, message: 'Sending to this domain is not allowed' };
  }
  if (attachments) {
    for (const att of attachments) {
      if (!att.filename || !att.data || !att.mimeType) {
        throw { status: 400, message: 'Each attachment must include name, content, and mimeType' };
      }
    }
  }
}
