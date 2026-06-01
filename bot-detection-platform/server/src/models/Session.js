import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    sessionToken: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
      index: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
      index: true,
    },
    endTime: Date,
    duration: Number, // in milliseconds
    pageUrl: String,
    userAgent: String,
    ipAddress: String,
    referer: String,

    // Behavior tracking
    eventCount: {
      type: Number,
      default: 0,
    },
    mouseEvents: {
      type: Number,
      default: 0,
    },
    scrollEvents: {
      type: Number,
      default: 0,
    },
    clickEvents: {
      type: Number,
      default: 0,
    },
    keyEvents: {
      type: Number,
      default: 0,
    },
    navigationEvents: {
      type: Number,
      default: 0,
    },
    idleTime: {
      type: Number,
      default: 0, // in milliseconds
    },
    maxIdlePeriod: {
      type: Number,
      default: 0, // longest period without activity
    },

    // Computed scores (to be filled by detection engine in Phase 5)
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    classification: {
      type: String,
      enum: ['HUMAN', 'SUSPICIOUS', 'BOT'],
      default: 'HUMAN',
    },
    detectionReasons: [String],

    // Metadata
    flags: {
      hasFastNavigation: { type: Boolean, default: false },
      hasNoMouseMovement: { type: Boolean, default: false },
      hasNoScroll: { type: Boolean, default: false },
      hasUnusualClickPattern: { type: Boolean, default: false },
      hasHighRequestRate: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    collection: 'sessions',
  }
);

// Index for efficient querying
sessionSchema.index({ userId: 1, startTime: -1 });
sessionSchema.index({ sessionToken: 1 });
sessionSchema.index({ status: 1, startTime: -1 });
sessionSchema.index({ riskScore: 1 });
sessionSchema.index({ classification: 1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
