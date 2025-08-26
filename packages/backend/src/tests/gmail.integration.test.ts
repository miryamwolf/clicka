import request from 'supertest';
import app from '../app';

jest.mock('../services/gmail-service', () => ({
    sendEmail: jest.fn(() =>
        Promise.resolve({
            status: 'sent',
            messageId: 'mocked-id',
        })
    ),
    listEmails: jest.fn(() =>
        Promise.resolve([
            {
                id: 'mocked-message-id',
                snippet: 'Mocked message snippet',
                headers: [],
            },
        ])
    ),
}));

describe('Email Notification', () => {
    const token = 'mocked-token';
    it('sends email with template', async () => {
        const res = await request(app)
            .post('/api/v1/users/me/messages/send')
            .set('Authorization', `Bearer ${token}`)
            .send({
                to: ['user@test.com'],
                templateId: 'welcome',
                variables: { name: 'User' },
            });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('sent');
        expect(res.body.messageId).toBe('mocked-id');
    });
    it('fails to send email without token', async () => {
        const res = await request(app)
            .post('/api/v1/users/me/messages/send')
            .send({
                to: ['user@test.com'],
                templateId: 'welcome',
                variables: { name: 'User' },
            });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Missing token');
    });
    it('lists emails', async () => {
        const res = await request(app)
            .get('/api/v1/users/me/messages')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe('mocked-message-id');
    });
    it('fails to list emails without token', async () => {
        const res = await request(app)
            .get('/api/v1/users/me/messages');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Missing token');
    });
});
