// models/User.js
import pkg from 'mongoose';
const { Schema, model } = pkg;
import { hash, compare } from 'bcrypt';

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return compare(candidatePassword, this.password);
};

// Create User model
const User = model('User', userSchema);

export const findOne = (query) => User.findOne(query);
export const find = () => User.find();
export const findById = (id) => User.findById(id);
export const findByIdAndUpdate = (id, update, options) => User.findByIdAndUpdate(id, update, options);
export const findByIdAndDelete = (id) => User.findByIdAndDelete(id);

export default User;