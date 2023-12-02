import { Router } from 'express';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContact,
  updateContact,
} from '../controllers/contactController.js';
import { isLoggedIn, protect } from '../controllers/authController.js';

const router = Router();

// Protect all routes after this middleware
router.use(protect);
router.use(isLoggedIn);

router.route('/').get(getAllContacts).post(createContact);
router.route('/:id').get(getContact).patch(updateContact).delete(deleteContact);

export default router;
