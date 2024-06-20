const {Schema, model, MongooseError, default: mongoose} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
      email: {
        type: String,
        minLength: 10,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        minLength: 4,
        required: [true, 'Password is required'],
    },
    createdStones: [{
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'Stone',
    }],
    likedStones: [{
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'Stone',
    }]
});

userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 12);
});

const User = model('User', userSchema);

module.exports = User;