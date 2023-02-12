import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'

import authRoute from './routes/auth.js'
import postRoute from './routes/posts.js'

const app = express()
dotenv.config()

// Constants
const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

// import {User} from './db.js';

// Middleware
app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use(express.static('uploads'))

// Routes
// http://localhost:3001/
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)

async function start() {
    try{
        // await mongoose.connect(
        //     `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.w9aumlf.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
        // )
        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
start();