/* eslint-disable no-undef */
import AWS from 'aws-sdk';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGOIN,
});

export const deleteOne = Modal =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.findByIdAndDelete(req.params.id);
    // const hasPermission = req.user.department === document.relatedTo;

    // if (!doc || !hasPermission) {
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = Modal =>
  catchAsync(async (req, res, next) => {
    const document = req?.file || undefined;
    const file = req?.files?.file?.at(0) || undefined;
    const instructionsFile = req?.files?.instructionsFile?.at(0) || undefined;
    const receiptLocal = req?.files?.receiptLocal?.at(0) || undefined;
    const receiptExternal = req?.files?.receiptExternal?.at(0) || undefined;

    let path;

    // Mailings path
    if (
      req.body.type === 'outgoing' ||
      req.body.type === 'localOutgoing' ||
      req.body.type === 'private'
    )
      path = `${req.user.department}/mailings/${req.body.type}/${req.body.refNum}`;

    if (req.body.type === 'incoming' || req.body.type === 'localIncoming')
      path = `${req.user.department}/mailings/${req.body.type}/${req.body.receiver}/${req.body.refNum}`;

    // Documents path
    if (
      req.body.type === 'file' ||
      req.body.type === 'Ministerial Decision' ||
      req.body.type === 'Administrative Circular' ||
      req.body.type === 'MOM'
    )
      path = `${req.user.department}/documents/${req.body.type}`;

    // Upload Document
    if (document) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${path}/${req.body.subject}-${Date.now()}.pdf`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      try {
        const response = await s3.upload(params).promise();
        req.body.file = response.Location;
      } catch (err) {
        console.log(err);
      }
    }

    // Upload mailing
    if (file) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${path}/${file.fieldname}-${Date.now()}-${req.body.refNum}.pdf`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        const response = await s3.upload(params).promise();
        req.body['file'] = response.Location;
      } catch (err) {
        console.log(err);
      }
    }

    if (instructionsFile) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${path}/${instructionsFile.fieldname}-${Date.now()}-${
          req.body.refNum
        }.pdf`,
        Body: instructionsFile.buffer,
        ContentType: instructionsFile.mimetype,
      };

      try {
        const response = await s3.upload(params).promise();
        req.body['instructionsFile'] = response.Location;
      } catch (err) {
        console.log(err);
      }
    }

    if (receiptLocal) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${path}/${receiptLocal.fieldname}-${Date.now()}-${
          req.body.refNum
        }.pdf`,
        Body: receiptLocal.buffer,
        ContentType: receiptLocal.mimetype,
      };

      try {
        const response = await s3.upload(params).promise();
        req.body['receiptLocal'] = response.Location;
      } catch (err) {
        console.log(err);
      }
    }

    if (receiptExternal) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${path}/${receiptExternal.fieldname}-${Date.now()}-${
          req.body.refNum
        }.pdf`,
        Body: receiptExternal.buffer,
        ContentType: receiptExternal.mimetype,
      };

      try {
        const response = await s3.upload(params).promise();
        req.body['receiptExternal'] = response.Location;
      } catch (err) {
        console.log(err);
      }
    }

    const doc = await Modal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // const hasPermission = req.user.department === doc.relatedTo;

    // if (!doc || !hasPermission) {
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const createOne = Modal =>
  catchAsync(async (req, res, next) => {
    let path;

    // Mailings path
    if (
      req.body.type === 'outgoing' ||
      req.body.type === 'localOutgoing' ||
      req.body.type === 'private'
    )
      path = `${req.user.department}/mailings/${req.body.type}/${
        req.body.refNum
      }/${req.body.subject}-${Date.now()}-${req.body.refNum}.pdf`;

    if (req.body.type === 'incoming' || req.body.type === 'localIncoming')
      path = `${req.user.department}/mailings/${req.body.type}/${
        req.body.receiver
      }/${req.body.refNum}/${req.body.subject}-${Date.now()}-${
        req.body.refNum
      }.pdf`;

    // Document path
    if (
      req.body.type === 'file' ||
      req.body.type === 'Ministerial Decision' ||
      req.body.type === 'Administrative Circular' ||
      req.body.type === 'MOM'
    )
      path = `${req.user.department}/documents/${req.body.type}/${
        req.body.subject
      }-${Date.now()}.pdf`;

    if (req.file) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${path}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      try {
        const response = await s3.upload(params).promise();
        req.body.file = response.Location;
      } catch (err) {
        console.log(err);
      }
    }

    const doc = await Modal.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Modal, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Modal.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;
    // const doc = await Modal.findById(req.params.id).populate({
    //   path: 'createdBy',
    //   select: 'name',
    // });
    // const hasPermission = req.user.department === document.relatedTo;

    // if (!document || !hasPermission) {
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = Modal =>
  catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(
      // Modal.find({ relatedTo: req.user.department }),
      Modal.find(),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .department();

    // Count Number of results when filtering
    let results = await features.query;
    results = results.length;

    // Excuse query again after count results and set pagination with clone() function
    const doc = await features.todayActivity().paginate().query.clone();

    res.status(200).json({
      status: 'success',
      results,
      data: {
        data: doc,
      },
    });

    // const doc = await features.paginate().query;

    // res.status(200).json({
    //   status: 'success',
    //   results,
    //   counts: doc.length,
    //   data: {
    //     data: doc,
    //   },
    // });
  });
