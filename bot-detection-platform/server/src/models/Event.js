import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    eventType: {
      type: String,
      enum: [
        'mousemove',
        'scroll',
        'click',
        'keydown',
        'navigation',
        'form_submit',
        'login_attempt',
      ],
      required: true,
      index: true,
    },
    x: Number,
    y: Number,
    scrollX: Number,
    scrollY: Number,
    targetElement: String,
    keyCode: Number,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      referer: String,
    },
  },
  {
    timestamps: true,
    collection: 'events',
  }
);

// Index for efficient querying
eventSchema.index({ sessionId: 1, timestamp: 1 });
eventSchema.index({ userId: 1, timestamp: 1 });
eventSchema.index({ eventType: 1, timestamp: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
