import request from 'supertest';
import app from '../app';

describe('User Management', () => {
    it('creates user with role', async () => {
        const res = await request(app)
            .post('/api/users/createUser')
            .send({
                email: 'test@test.com',
                name: 'Test',
                role: 'MANAGER',
            });

        expect(res.status).toBe(201);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe('test@test.com');
        expect(res.body.user.role).toBe('MANAGER');
        expect(res.body.user.isActive).toBe(true);
    });

    it('prevents unauthorized role assignment', async () => {
        const res = await request(app)
            .post('/api/users/createUser')
            .send({
                email: 'test2@test.com',
                name: 'Test2',
                role: 'SYSTEM_ADMIN', // תפקיד שחייב להיות מוגבל
            });

        expect(res.status).toBe(403);
        expect(res.body.error).toBeDefined();
    });

    it('deactivates user', async () => {
        // Arrange: צור משתמש חדש
        const createRes = await request(app)
            .post('/api/users/createUser')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'MANAGER', // ודא שהתפקיד תקין
            });

        const userId = createRes.body.user.id;

        // Act: שלח בקשת deactivate
        const res = await request(app)
            .patch(`/api/users/${userId}/deactivate`);

        // Assert: בדוק את התוצאה
        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.isActive).toBe(false);
    });

    it('prevents login for deactivated user', async () => {
        // Arrange: צור משתמש מושבת
        const createRes = await request(app)
            .post('/api/users/createUser')
            .send({
                email: 'deactivated@test.com',
                name: 'Deactivated User',
                password: 'password123',
                role: 'MANAGER', // ודא שהתפקיד תקין
            });

        const userId = createRes.body.user.id;

        // Act: השבת את המשתמש
        await request(app)
            .patch(`/api/users/${userId}/deactivate`);

        // Act: נסה להיכנס עם המשתמש המושבת
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'deactivated@test.com',
                password: 'password123',
            });

        expect(res.status).toBe(403);
        expect(res.body.error).toBe('User is deactivated');
    });
});
