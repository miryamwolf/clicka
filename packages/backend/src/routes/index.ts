import { Router } from 'express';
import authRouter from './auth';
import healthRouter from './health';
import calendarRouter from './calendar-route';
import driveRouter from './drive-route';
import gmailRouter from './gmail-route';
import interactionRouter from './leadInteraction.route'

const router = Router();

router.use('/health', healthRouter);     
router.use('/drive', driveRouter);      
router.use('/calendar', calendarRouter);  
router.use('/gmail', gmailRouter);    
router.use('api/interaction', interactionRouter)
router.use('/', authRouter);             

export default router;
