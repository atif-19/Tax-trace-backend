
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // to hash the passwords before storing

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // No two users can have the same email
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ] // this is so that people add valid email address
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // When we fetch a user, don't include the password by default
    },
    monthlyIncome: {
        type: Number,
        default: 50000
    },
    workDaysPerMonth: {
        type: Number,
        default: 20
    },
    workHoursPerDay: {
        type: Number,
        default: 8
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Encryption Middleware: Runs BEFORE saving the user
// we hash the password using this middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    // we generate the salt of the password
    const salt = await bcrypt.genSalt(10);
    // hash function (we add salt in password before adding it)
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);