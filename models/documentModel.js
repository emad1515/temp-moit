import mongoose from 'mongoose';
import { DOCUMENT_STATUS, DOCUMENT_TYPE } from '../utils/constants.js';

const documentSchema = new mongoose.Schema({
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
    enum: {
      values: Object.values(DOCUMENT_TYPE),
      message: `Type is either: ${Object.values(DOCUMENT_TYPE).join(', ')}. `,
    },
  },
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'A document must have a sender'],
  },

  receiver: {
    type: mongoose.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'A document must have a receiver'],
  },
  refNum: {
    type: String,
    required: [true, 'A document must have a reference number'],
  },
  theirRefNum: String,
  status: {
    type: String,
    enum: Object.values(DOCUMENT_STATUS),
    default: DOCUMENT_STATUS.PENDING,
  },
  responseDays: Number,
  deliveredBy: {
    type: String,
    trim: true,
  },
  startDate: Date,
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
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
  isTreating: {
    type: Boolean,
    default: false,
  },
  ministerOffice: {
    type: Boolean,
    default: false,
  },
  viceOffice: {
    type: Boolean,
    default: false,
  },
  deputyOffice: {
    type: Boolean,
    default: false,
  },
  deputyIndustryOffice: {
    type: Boolean,
    default: false,
  },
  deputyInternalTradeOffice: {
    type: Boolean,
    default: false,
  },
  deputyForeignTradeOffice: {
    type: Boolean,
    default: false,
  },
  deputyBusinessServicesOffice: {
    type: Boolean,
    default: false,
  },
  technicalOffice: {
    type: Boolean,
    default: false,
  },
  ministryOfficesInTheGovernorates: {
    type: Boolean,
    default: false,
  },
  internalAuditOffice: {
    type: Boolean,
    default: false,
  },
  publicBodiesInstitutionsAndMixedCompaniesOffice: {
    type: Boolean,
    default: false,
  },
  hrOffice: {
    type: Boolean,
    default: false,
  },
  womanOffice: {
    type: Boolean,
    default: false,
  },
  legalAffairsOffice: {
    type: Boolean,
    default: false,
  },
  planningAndInformationOffice: {
    type: Boolean,
    default: false,
  },
  financialAffairsOffice: {
    type: Boolean,
    default: false,
  },
  publicRelationsAndMediaOffice: {
    type: Boolean,
    default: false,
  },
  informationSystemsOffice: {
    type: Boolean,
    default: false,
  },
  coordinationWtoOffice: {
    type: Boolean,
    default: false,
  },
  industrialAreasOffice: {
    type: Boolean,
    default: false,
  },
  industrialDevelopmentAndInvestmentOffice: {
    type: Boolean,
    default: false,
  },
  industrialControlOffice: {
    type: Boolean,
    default: false,
  },
  smallIndustriesOffice: {
    type: Boolean,
    default: false,
  },
  marketStabilityOffice: {
    type: Boolean,
    default: false,
  },
  consumerProtectionOffice: {
    type: Boolean,
    default: false,
  },
  competitionAndMonopolyPreventionOffice: {
    type: Boolean,
    default: false,
  },
  operationsRoomOffice: {
    type: Boolean,
    default: false,
  },
  internationalBusinessRelationsOffice: {
    type: Boolean,
    default: false,
  },
  exportDevelopmentOffice: {
    type: Boolean,
    default: false,
  },
  protectingNationalProductsOffice: {
    type: Boolean,
    default: false,
  },
  commercialAgreementsAndCommercialZonesOffice: {
    type: Boolean,
    default: false,
  },
  companiesOffice: {
    type: Boolean,
    default: false,
  },
  agenciesOffice: {
    type: Boolean,
    default: false,
  },
  commercialRegisterOffice: {
    type: Boolean,
    default: false,
  },
  trademarksOffice: {
    type: Boolean,
    default: false,
  },
  regulatingTheAuditingAndAuditingProfessionOffice: {
    type: Boolean,
    default: false,
  },
  insuranceCompaniesOffice: {
    type: Boolean,
    default: false,
  },
  customersServiceOffice: {
    type: Boolean,
    default: false,
  },
  file: String,
  receiptLocal: String,
  receiptExternal: String,
  instructionsFile: String,
  cc1: String,
  cc2: String,
  cc3: String,
  cc4: String,
  cc5: String,
  cc6: String,
  cc7: String,
  cc8: String,
  listOfCc: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Contact',
    },
  ],
  secretDocument: {
    type: Boolean,
    default: false,
  },
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// documentSchema.pre('save', function () {
//   console.log(this);
// });

documentSchema.index({ status: 1 });

documentSchema.pre(/^find/, function (next) {
  this.find({ secretDocument: { $ne: true } });

  this.start = Date.now();
  next();
});

documentSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  //   console.log(docs);
  next();
});

documentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'sender',
    select: 'jobTitle name email phone',
  })
    .populate({
      path: 'receiver',
      select: 'jobTitle name email phone',
    })
    .populate({
      path: 'listOfCc',
      select: 'jobTitle email',
    });

  next();
});

// AGGREGATION MIDDLEWARE
documentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretDocument: { $ne: true } } });
  next();
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
