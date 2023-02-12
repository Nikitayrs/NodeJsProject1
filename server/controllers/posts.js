//import Post from '../models/Post.js'
//import User from '../models/User.js'
import path, { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import read from 'node-readability'
import { DB } from '../db.js'

// const connection = await mysql.createConnection({
//     connectionLimit: 5,
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: 'root',
//     database: 'delete'
// })

// Create Post
export const createPost = async(req, res) => {
    try {
        console.log("6A")
        const {title, text} = req.body
        console.log("6AA " + title + " " + text + " " + req.userId)

        const isTitle = await DB.findTilePost(title, (err) => {
            return res.json({
                message: 'Призошла ошибка сервера.'
            })
        })
        console.log("isTitle " + isTitle[0])
        if(isTitle[0] != undefined) {
            console.log(Boolean(isTitle))
            return res.json({
                message: 'Данный title уже используется.'
            })
        }

        const user = await DB.findById(req.userId, (err) => {
            return res.json({
                message: 'Произошла ошибка сервера.'
            })
        })
        console.log('USER ' + user[0].username)
        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            console.log('r2 ' + fileName)
            const __dirname = dirname(fileURLToPath(import.meta.url))
            console.log("10A " + user[0].username)
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))

            const newPostWithImage = {
                username: user[0].username,
                title,
                text,
                imgUrl: fileName,
                author: req.userId,
            }
            console.log("11A " + newPostWithImage)
            const url = "/api/posts"
            console.log(url)
            
            await DB.createPost(newPostWithImage, (err) => {
                return res.json({ message: 'Повторите запрос на регистрацию.' })
            })
            const titlePost = await DB.findTilePost(title, (err) => {
                return res.json({
                    message: 'Произошла ошибка сервера.'
                })
            })
            console.log("A11.1 " + titlePost[0])
            // read(url, (err, result) => {
            //     if (err || !result) 
            //         return res.status(500).send('Error downloading users')
            //     console.log("READ")
            //     User.createPost(newPostWithImage, (err) => {
            //         return res.json({ message: 'Повторите запрос на регистрацию.' })
            //     })
            //     resolve(true)
            //     return
            // })
            await DB.findByIdAndUpdate(req.userId, titlePost[0], (err) => {
                return res.json({
                    message: 'Произошла ошибка сервера.'
                })
            })
            return res.json(newPostWithImage)
        }
        const newPostWithoutImage = {
            username: user[0].username,
            title,
            text,
            imgUrl: '',
            author: req.userId,
        }
        await User.createPost(newPostWithoutImage, (err) => {
            return res.json({ message: 'Повторите запрос на регистрацию.' })
        })
        // read(url, (err, result) => {
        //     if (err || !result) 
        //         return res.status(500).send('Error downloading users')
        //     console.log("READ")
        //     User.createPost(newPostWithoutImage, (err) => {
        //         return res.json({ message: 'Повторите запрос на регистрацию.' })
        //     })
        // })
        console.log("12A " + req.userId)
        await User.findByIdAndUpdate(req.userId, newPostWithoutImage, (err) => {
            return res.json({
                message: 'Произошла ошибка сервера.'
            })
        })
        // await User.findByIdAndUpdate(req.userId, {
        //     $push: { posts: newPostWithoutImage },
        // })
        console.log("13A")     
        return res.json(newPostWithImage)
    } catch (error) {
        return res.json({ message: 'Что-то пошло не так. ' + error })
    }
}

// Get All Posts
export const getAll = async (req, res) => {
    try {
        const posts = await DB.findSort()
        const popularPosts = await DB.findSortLimit()

        console.log('GET ALL ' + posts + ' aaa ' + popularPosts)
        if(!posts) {
            return res.json({ message: 'Постов нет' })
        }

        return res.json({ posts, popularPosts })
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Get By Id
export const getById = async (req, res) => {
    try {
        await DB.UpdateViewPost(req.params.id)
        const post = await DB.PostUpdateView(req.params.id)

        return res.json(post)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Get My Posts
export const getMyPosts = async (req, res) => {
    try {
        const user = await DB.findById(req.userId)
        const list = await Promise.all(
            user.posts.map(post => {
                return DB.findById(post._id)
            })
        )

        return res.json(list)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}
// RemovePost
export const removePost = async (req, res) => {
    try {
        const post = await DB.findByIdAndDelete(req.params.id)
        if(!post) return res.json({ message: 'Такого поста не существует' })

        await DB.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id },
        })
        
        return res.json({ message: 'Пост был удалён.' })
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}