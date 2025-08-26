import request from 'supertest';
import app from '../app';

// Mocking the authService with dynamic responses
jest.mock('../services/authService', () => {
    return {
        loginWithGoogle: jest.fn((role) =>
            Promise.resolve({
                user: { id: '1', email: 'user@test.com', role },
                token: 'mocked-token',
            })
        ),
        verifySession: jest.fn(() => Promise.resolve(true)),
    };
});

describe('Google OAuth Authentication', () => {
    it('redirects to Google OAuth on login', async () => {
        const res = await request(app).get('/api/auth/google');

        expect(res.status).toBe(302);
        expect(res.headers.location).toContain('accounts.google.com');
    });

    it('sets session and returns user + token after successful login', async () => {
        const role = 'MANAGER';
        const res = await request(app).get('/api/auth/google/callback?code=fakecode');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token', 'mocked-token');
        expect(res.body.user.email).toBe('user@test.com');
        expect(res.body.user.role).toBe(role);
    });

    it('returns user with different roles', async () => {
        const roles = ['ADMIN', 'MANAGER', 'SYSTEM_ADMIN'];

        for (const role of roles) {
            const res = await request(app).get(`/api/auth/google/callback?code=fakecode&role=${role}`);

            expect(res.status).toBe(200);
            expect(res.body.user.role).toBe(role);
        }
    });
});
