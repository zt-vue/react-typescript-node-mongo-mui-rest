import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRoles } from '../types';

// Use native promises.
mongoose.Promise = global.Promise;

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  name: string;
  role: UserRoles;
};

type Callback = (err: any) => void;
// Define the User schema.
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: { type: String, default: UserRoles.regular, required: true },
  name: { type: String, required: true },
});

// Generate a password hash (with an auto-generated salt for simplicity here).
const generateHash = (password: string) => {
  return bcrypt.hashSync(password, 8);
};

// Check if the password is valid by comparing with the stored hash.
UserSchema.methods.validatePassword = function (password: string) {
  const user = this as UserDocument;
  return bcrypt.compareSync(password, user.password);
};

// Make sure the email has not been used.
UserSchema.path('email').validate({
  isAsync: true,
  validator: function (email: string, callback: Callback) {
    const User = mongoose.model('User');
    // Check only when it is a new User or when the email has been modified.
    if (this.isNew || this.isModified('email')) {
      User.find({ email: email }).exec((err, Users) => {
        callback(!err && Users.length === 0);
      });
    } else {
      return callback(true);
    }
  },
  message: 'This email already exists. Please try to log in instead.',
});

// Pre-save hook to ensure consistency.
UserSchema.pre('save', function (next) {
  // Make sure certain fields are blank depending on the User type.
  // Make sure the password is hashed before being stored.
  const user = this as UserDocument;
  if (user.isModified('password')) {
    user.password = generateHash(user.password);
  }
  next();
});

export const User = mongoose.model<UserDocument>('User', UserSchema);

export const sanitizeUser = (user: UserDocument) => {
  const userObj = user.toObject();
  delete userObj.password;
  return userObj as UserDocument;
};
