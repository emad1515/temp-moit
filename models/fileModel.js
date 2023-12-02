import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'A document must have a subject'],
      trim: true,
      maxlength: [
        255,
        'A document subject must have less or equal than 255 characters',
      ],
      minlength: [
        5,
        'A document subject must have more or equal than 10 characters',
      ],
    },
    type: {
      type: String,
      required: [true, 'A document must have a type'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    relatedTo: String,
    notes: {
      type: String,
      trim: true,
    },
    tags: [String],
    secretDocument: {
      type: Boolean,
      default: false,
    },
    file: String,
  },
  { timestamps: true }
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// documentSchema.pre('save', function () {
//   console.log(this);
// });

// documentSchema.index({ status: 1 });

fileSchema.pre(/^find/, function (next) {
  this.find({ secretDocument: { $ne: true } });

  this.start = Date.now();
  next();
});

fileSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  //   console.log(docs);
  next();
});

// documentSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'sender',
//     select: 'jobTitle name email phone',
//   })
//     .populate({
//       path: 'receiver',
//       select: 'jobTitle name email phone',
//     })
//     .populate({
//       path: 'listOfCc',
//       select: 'jobTitle email',
//     });

//   next();
// });

// AGGREGATION MIDDLEWARE
// documentSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretDocument: { $ne: true } } });
//   next();
// });

const FILE = mongoose.model('File', fileSchema);

export default FILE;
