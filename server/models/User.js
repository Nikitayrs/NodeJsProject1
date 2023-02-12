import mongoose, { mongo } from 'mongoose'

const UserSchema = new mongoose.SChema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    {
        timeStamps: true,
    }
)

export default mongoose.model('User', UserSchema)