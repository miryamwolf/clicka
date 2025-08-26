import request from 'supertest';
import app from '../app';

jest.mock('../services/authService', () => ({
    loginWithGoogle: jest.fn(() => Promise.resolve({
        user: { id: '1', email: 'user@test.com', role: 'MANAGER' },
        token: 'mocked-token',
    })),
    verifySession: jest.fn(() => Promise.resolve(true)),
}));

describe('Google OAuth Authentication', () => {
    it('redirects to Google OAuth on login', async () => {
        const res = await request(app).get('/auth/google');
        expect(res.status).toBe(302);
        expect(res.headers.location).toContain('accounts.google.com');
    });

    it('sets session and role after successful login', async () => {
        const res = await request(app).get('/auth/google/callback?code=fakecode');
        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.token).toBe('mocked-token');
        expect(res.body.user.role).toBe('MANAGER');
    });
});
