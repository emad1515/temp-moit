import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please tell us the job title!'],
    },
    name: String,
    email: {
      type: String,
      lowercase: true,
    },
    phone: String,
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
