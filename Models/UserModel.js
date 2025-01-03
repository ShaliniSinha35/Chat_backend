const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: true,
            min: 6,
            max: 255
        },
        email: {
            type: String,
            required: true,
            min: 6,
            max: 255,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 1024
        }
    },
    {
     timestamps: true
    }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;