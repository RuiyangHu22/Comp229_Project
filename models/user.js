const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true }, // Salt for password hashing
});

// Hash password before saving
userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
        this.password = crypto
            .pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha512')
            .toString('hex'); // Hash password
    }
    next();
});

// Method to validate password
userSchema.methods.validatePassword = function(password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex');
    return this.password === hash;
};

module.exports = mongoose.model('User', userSchema);