import mongoose from 'mongoose';

const loginAttemptSchema = new mongoose.Schema(
  {
    email: { type: String, index: true },
    ipAddress: { type: String, index: true },
    success: { type: Boolean, default: false },
    userAgent: String,
  },
  {
    timestamps: true,
    collection: 'login_attempts',
  }
);

loginAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);

export default LoginAttempt;
