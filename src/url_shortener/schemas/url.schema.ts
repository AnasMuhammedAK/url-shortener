import * as mongoose from 'mongoose';

export const UrlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    originalURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ time: { type: Date } }],
  },
  { timestamps: true },
);
