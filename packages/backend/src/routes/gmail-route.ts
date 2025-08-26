import { Router } from 'express';
import multer from 'multer';
import { postEmail, getListEmails } from '../controllers/gmail-controller';

const router = Router();
const upload = multer(); // ברירת מחדל - זיכרון (memory storage)

router.post('/v1/users/me/messages/send', upload.any(), postEmail);
router.get('/v1/users/me/messages', getListEmails);

export default router;
