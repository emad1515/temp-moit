/* eslint-disable no-undef */
import multer from 'multer';

import File from '../models/fileModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handleFactory.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Not a pdf! Please upload only PDFs.', 400), false);
  }
};

const upload = multer({ storage, fileFilter });

export const uploadFile = upload.single('file');

export const setFileUserIds = (req, res, next) => {
  req.body.createdBy = req.user._id;
  req.body.relatedTo = req.user.department;

  next();
};

export const checkPermission = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id);
  const hasPermission = req.user.department === file?.relatedTo;

  if (!hasPermission) {
    return next(
      new AppError('You do not have permission to access this file', 404)
    );
  }

  next();
});

export const getAllFiles = getAll(File);
export const getFile = getOne(File, {
  path: 'createdBy',
  select: 'name',
});
export const createFile = createOne(File);
export const updateFile = updateOne(File);
export const deleteFile = deleteOne(File);
