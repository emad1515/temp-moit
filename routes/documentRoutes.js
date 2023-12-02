import { Router } from 'express';
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocument,
  getDocumentStats,
  setDocumentUserIds,
  updateDocument,
  uploadDocumentFile,
  uploadDocumentFiles,
} from '../controllers/documentController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/stats').get(getDocumentStats);
router
  .route('/')
  .get(getAllDocuments)
  .post(setDocumentUserIds, uploadDocumentFile, createDocument);

// Check if document related to the user department
// router.use(checkPermission);
router
  .route('/:id')
  .get(getDocument)
  .patch(uploadDocumentFiles, updateDocument)
  .delete(restrictTo('admin', 'supervisor', 'user'), deleteDocument);

export default router;
