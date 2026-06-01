import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  type: {
    type: String,
    enum: ['bot-detected', 'session-ended', 'high-risk', 'anomaly', 'system'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    sessionId: mongoose.Schema.Types.ObjectId,
    riskScore: Number,
    classification: String,
    reason: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ type: 1, severity: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
