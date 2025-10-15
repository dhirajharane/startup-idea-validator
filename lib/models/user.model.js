import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must be at least 8 characters long.'],
        select: false,
    },
    passwordChangedAt: {
        type: Date,
        select: false,
    },
    creditsLeft: {
        type: Number,
        default: 5,
        min: 0,
    },
    reportsHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Report',
    }],
    downloads: {
        type: Number,
        default: 0,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        select: false,
    },
    otpExpires: {
        type: Date,
        select: false,
    },
    loginToken: {
        type: String,
        select: false,
    },
    loginTokenExpires: {
        type: Date,
        select: false,
    }
}, {
    timestamps: true,
    collection: 'users',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    if (!this.isNew) {
        this.passwordChangedAt = Date.now() - 1000;
    }
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

export default mongoose.models?.User || mongoose.model('User', UserSchema);
