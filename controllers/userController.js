/* eslint-disable no-undef */
import multer from 'multer';
import AWS from 'aws-sdk';

import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne, getAll, getOne, updateOne } from './handleFactory.js';
// import sharp from 'sharp';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads');
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname;
//     cb(null, fileName);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage, fileFilter });

export const uploadUserAvatar = upload.single('avatar');

// export const resizeUserAvatar = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toBuffer();
//   // .toFile(`uploads/users/${req.file.filename}`);

//   next();
// });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${req.user.department}/users/${req.user.name}/${Date.now()}.jpeg`,
    Body: req?.file?.buffer,
    ContentType: req?.file?.mimetype,
  };

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  if (req.file) {
    try {
      const response = await s3.upload(params).promise();
      filteredBody.avatar = response.Location;
    } catch (err) {
      console.log(err);
    }
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead',
  });
};

export const getAllUsers = getAll(User);
export const getUser = getOne(User);

// Do NOT update passwords with this!
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
