import { Request } from 'express';

/**
 * Validate file upload input
 * Throws: 400 (Bad Request), 422 (Unprocessable Entity), 403 (Forbidden)
 */
export function validateUploadFile(req: Request) {
  const file = req.file;
  if (!file) {
    throw { status: 400, message: 'Missing file' };
  }
  if (!file.originalname || file.originalname.length > 255) {
    throw { status: 422, message: 'Invalid file name' };
  }
  const forbiddenTypes = ['application/x-msdownload', 'application/x-sh']; 
  if (forbiddenTypes.includes(file.mimetype)) {
    throw { status: 403, message: 'File type not allowed' };
  }
  if (file.size > 10 * 1024 * 1024) {
    throw { status: 422, message: 'File too large (max 10MB)' };
  }
}
export function validateFileId(fileId: string) {
  if (!fileId) {
    throw { status: 400, message: 'Missing fileId' };
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(fileId)) {
    throw { status: 422, message: 'Invalid fileId format' };
  }
}
export function validateSharePermissions(body: any) {
  if (!body?.role || !body?.type) {
    throw { status: 400, message: 'Missing required permission fields (role, type)' };
  }
  if (!['reader', 'writer', 'commenter'].includes(body.role)) {
    throw { status: 422, message: 'Invalid role' };
  }
  if (!['user', 'group', 'domain', 'anyone'].includes(body.type)) {
    throw { status: 422, message: 'Invalid permission type' };
  }
}
