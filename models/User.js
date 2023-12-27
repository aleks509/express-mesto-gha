import mongoose from 'mongoose';

const userScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            ruquired: {
                value: true,
                message: "Поле name является обязательным",
            },
            minlength: 2,
            maxlength: 30,

    },
        about: {
            type: String,
            ruquired: {
                value: true,
                message: "Поле about является обязательным",
            },
            minlength: 2,
            maxlength: 30,
        },
        avatar: {
            type: String,
            ruquired: true
        }
}, 
    {versionKey: false})

export default mongoose.model('user', userScheme)

    // {versionKey: false, timestamps: true})