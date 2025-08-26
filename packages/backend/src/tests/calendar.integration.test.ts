import request from 'supertest';
import app from '../app';

jest.mock('../services/calendar.service', () => ({
    createEvent: jest.fn(() => Promise.resolve({ eventId: 'mocked-event-id' })),
    checkAvailability: jest.fn(() => Promise.resolve(true)),
}));

describe('Google Calendar Integration', () => {
    it('creates calendar event', async () => {
        const res = await request(app)
            .post('/api/calendars/primary/events')
            .send({
                summary: 'פגישה',
                start: '2025-07-20T10:00:00Z',
                end: '2025-07-20T11:00:00Z',
                attendees: ['user@test.com'],
            });

        expect(res.status).toBe(201);
        expect(res.body.eventId).toBe('mocked-event-id');
    });

    it('checks room availability', async () => {
        const res = await request(app)
            .post('/api/calendars/primary/freeBusy')
            .send({
                start: '2025-07-20T10:00:00Z',
                end: '2025-07-20T11:00:00Z',
                room: '1',
            });

        expect(res.status).toBe(200);
        expect(res.body.available).toBe(true);
    });
});
