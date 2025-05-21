import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  created_time: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 