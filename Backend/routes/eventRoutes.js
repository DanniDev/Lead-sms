import express from 'express';
import { getApiKey } from '../controllers/eventController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

//INCOMING CLOSE WEBHOOK POST
// router.route('/unsubscribe/:id').delete(protect, unsubscribeHook);
router.route('/key').post(protect, getApiKey);

export default router;
