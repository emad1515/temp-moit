/* eslint-disable no-undef */
import multer from 'multer';

import Document from '../models/documentModel.js';
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

export const uploadDocumentFile = upload.single('file');

export const uploadDocumentFiles = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'instructionsFile', maxCount: 1 },
  { name: 'receiptLocal', maxCount: 1 },
  { name: 'receiptExternal', maxCount: 1 },
]);

export const setDocumentUserIds = (req, res, next) => {
  req.body.createdBy = req.user._id;
  req.body.relatedTo = req.user.department;

  next();
};

export const checkPermission = catchAsync(async (req, res, next) => {
  const document = await Document.findById(req.params.id);
  const hasPermission = req.user.department === document?.relatedTo;

  if (!hasPermission) {
    return next(
      new AppError('You do not have permission to access this document', 404)
    );
  }

  next();
});

export const getAllDocuments = getAll(Document);
export const getDocument = getOne(Document, {
  path: 'createdBy',
  select: 'name',
});
export const createDocument = createOne(Document);
export const updateDocument = updateOne(Document);
export const deleteDocument = deleteOne(Document);

// export const getAllDocuments = catchAsync(async (req, res, next) => {
//   // EXECUTE QUERY
//   const features = new APIFeatures(
//     // Document.find({ relatedTo: req.user.department }),
//     Document.find(),
//     req.query
//   )
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const documents = await features.query;

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: documents.length,
//     data: {
//       documents,
//     },
//   });
// });

// export const getDocument = catchAsync(async (req, res, next) => {
//   const document = await Document.findById(req.params.id).populate({
//     path: 'createdBy',
//     select: 'name',
//   });
//   const hasPermission = req.user.department === document.relatedTo;

//   if (!document || !hasPermission) {
//     return next(new AppError('No document found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       document,
//     },
//   });
// });

// export const createDocument = catchAsync(async (req, res, next) => {
//   req.body.createdBy = req.user._id;
//   req.body.relatedTo = req.user.department;

//   const newDocument = await Document.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       document: newDocument,
//     },
//   });
// });

// export const updateDocument = catchAsync(async (req, res, next) => {
//   const document = await Document.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   const hasPermission = req.user.department === document.relatedTo;

//   if (!document || !hasPermission) {
//     return next(new AppError('No document found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       document,
//     },
//   });
// });
// export const deleteDocument = catchAsync(async (req, res, next) => {
//   const document = await Document.findByIdAndDelete(req.params.id);
// const hasPermission = req.user.department === document.relatedTo;

// if (!document || !hasPermission) {
//   return next(new AppError('No document found with that ID', 404));
// }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

export const getDocumentStats = catchAsync(async (req, res, next) => {
  const stats = await Document.aggregate([
    { $match: { responseDays: { $gte: 0 } } },
    { $group: { _id: '$sender', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
