import { Router } from 'express';

import { protect, restrictTo } from '../controllers/authController.js';
import {
  createFile,
  deleteFile,
  getAllFiles,
  getFile,
  setFileUserIds,
  updateFile,
  uploadFile,
} from '../controllers/fileController.js';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/').get(getAllFiles).post(setFileUserIds, uploadFile, createFile);

// Check if document related to the user department
// router.use(checkPermission);
router
  .route('/:id')
  .get(getFile)
  .patch(uploadFile, updateFile)
  .delete(restrictTo('admin', 'supervisor', 'user'), deleteFile);

export default router;
