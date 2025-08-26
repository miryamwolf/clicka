import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Health endpoint called');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
