/* Model of database when register */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  image: {
    type: String,
    default: 
    'https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642479/992490_sskqn3.png'
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: 'user'
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;