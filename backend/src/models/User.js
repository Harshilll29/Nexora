import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
     resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordOTPExpires: {
        type: Date,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    profilePic:{
        type: String,
        default: '',
    },
    nativeLanguage: {
        type: String,
        default: ''
    },
    learningLanguage: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

//pre hook
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    try{
        const  salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(error){
        next(error);
    }
});

userSchema.methods.comparePassword = async function(enteredPassword) {

    const isPasswordCorrect =  await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;

}

const User = mongoose.model('User', userSchema);


export default User;
