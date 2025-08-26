import request from 'supertest';
import app from '../app';

// מוקאינג של פונקציית האימות
jest.mock('../middlewares/authMiddleware', () => ({
    verifySession: jest.fn((req, res, next) => {
        const token = req.cookies.session;

        if (!token) {
            return res.status(401).json({ error: 'not authenticated' });
        }

        if (token === 'expiredtoken') {
            return res.status(401).json({ error: 'TokenExpired' });
        }

        // דמיין שהמשתמש נמצא
        (req as any).user = { id: 'userId', email: 'user@example.com', googleId: 'googleId' };
        next();
    }),
}));

describe('Security', () => {
    it('blocks access without token', async () => {
        const res = await request(app).get('/api/users/me').set('Cookie', 'session=');
        expect(res.status).toBe(401);
    });

    it('blocks unauthorized role from admin route', async () => {
        const res = await request(app)
            .get('/api/admin/dashboard')
            .set('Cookie', 'session=usertoken; role=USER'); // משתמש עם תפקיד רגיל

        expect(res.status).toBe(403); // Forbidden
    });

    it('allows access for authorized role', async () => {
        const res = await request(app)
            .get('/api/admin/dashboard')
            .set('Cookie', 'session=usertoken; role=ADMIN'); // משתמש עם תפקיד מנהל

        expect(res.status).toBe(200); // או סטטוס אחר שמתאים
    });

    it('rejects invalid input', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                email: 'notanemail',
                name: '',
                role: 'MANAGER',
            });

        expect(res.status).toBe(400); // Bad Request
    });

    it('rejects expired token', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Cookie', 'session=expiredtoken');

        expect(res.status).toBe(401); // Unauthorized
    });
});
