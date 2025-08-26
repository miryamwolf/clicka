import { Request } from 'express';

/**
 * Validates query parameters for listing Gmail messages.
 * Throws HTTP errors: 400 (bad format), 422 (invalid values).
 */
export function validateListEmailQuery(req: Request) {
  const { maxResults, q, labelIds, pageToken } = req.query;
  if (maxResults !== undefined) {
    const num = Number(maxResults);
    if (isNaN(num) || !Number.isInteger(num)) {
      throw { status: 400, message: 'maxResults must be an integer' };
    }
    if (num < 1 || num > 500) {
      throw { status: 422, message: 'maxResults must be between 1 and 500' };
    }
  }
  if (q !== undefined && typeof q !== 'string') {
    throw { status: 400, message: 'q must be a string' };
  }
  if (labelIds !== undefined) {
    const labels = Array.isArray(labelIds) ? labelIds : [labelIds];
    for (const label of labels) {
      if (typeof label !== 'string') {
        throw { status: 400, message: 'Each labelId must be a string' };
      }
    }
  }
  if (pageToken !== undefined && typeof pageToken !== 'string') {
    throw { status: 400, message: 'pageToken must be a string' };
  }
}
