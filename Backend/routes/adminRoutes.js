import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { authAdmin, getAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.route('/login').post(authAdmin);
router.route('/admin').post(protect, getAdmin);

export default router;
