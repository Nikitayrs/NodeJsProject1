//import User from '../models/User.js'
import bcrypt from 'bcryptjs'
//import { reset } from 'nodemon'
import jwt from 'jsonwebtoken'

import { DB } from '../db.js';

import read from 'node-readability'

// Register user
export const register = (req, res) => {
    try {
        const { username, password } =  req.body

        console.log('1 ' + username + ' ' + password)
        //const isUsed = await User.findOne({ username })
        const isUsed = DB.findOne(username, (err) => {
            return res.json({
                message: 'Произошла ошибка сервера.'
            })
        })
        console.log("11 " + isUsed[0])
        if(isUsed[0] != undefined) {
            console.log(Boolean(isUsed))
            return res.json({
                message: 'Данный username уже занят.'
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = {
            username, 
            password: hash,
        }

        console.log('tokenRegister1 ' + newUser.id)
        const token = jwt.sign(
            {
                id: newUser.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' } 
        )

        console.log('tokenRegister2 ' + token)

        const url = "/api/auth/register"
        console.log(url)
        read(url, (err, result) => {
            if (err || !result) 
                return res.status(500).send('Error downloading users')
                DB.create(newUser.username, newUser.password, (err, user) => {
                console.log(newUser.username)
                return res.json({ message: 'Повторите запрос на регистрацию.' })
            })
        })

        return res.json({
            newUser,
            token,
            message: 'Регистрация прошла успешно.',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при создании пользователя.' })
    }
}

// Login user
export const login = async (req, res) => {
    try {
        console.log('1')
        const { username, password } =  req.body

        console.log('1 ' + username + ' ' + password)
        //const isUsed = await User.findOne({ username })
        const user = await DB.findOne(username, (err) => {
            return res.json({
                message: 'Произошла ошибка сервера.'
            })
        })

        console.log('2 ' + !user)

        if(!user[0]) {
            return reset.json({
                message: 'Такого юзера не существует.'
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync('pass7', salt)

        console.log(typeof(hash) + ' ' + typeof(user[0].password))
        console.log('zn ' + hash + ' ' + user[0].password)
        console.log('== ' + hash == user[0].password)

        console.log('3 ' + password + ' ' + user[0].password)

        const isPasswordCorrect = bcrypt.compareSync(password, user[0].password)

        console.log('33 ' + !isPasswordCorrect + ' ' + password)
            console.log('333 ' + isPasswordCorrect)
            if(!isPasswordCorrect) {
                return res.json({
                    message: 'Неверный пароль.'
                })
            }
            console.log('4 ' + user[0].id)
            console.log('44 ' + user[0].username)

            const token = jwt.sign({
                id: user[0].id,
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' } 
            )
            console.log("token login " + token)

            return res.json({
                token,
                user,
                message: 'Вы вошли в систему.',
            })
    } catch(error) {
        console.log(error)
        return res.json({message: 'Ошибка при авторизации.'})
    }
}
// Get Me
export const getMe = async (req, res) => {
    try {
        console.log('getMeee')
        const user = await DB.findById(req.userId, (err) => {
            return res.json({
                message: 'Произошла ошибка сервера.'
            })
        })

        console.log("A8 " + user)
        if(!user) {
            return reset.json({
                message: 'Такого юзера не существует.'
            })
        }

        console.log("A9 " + user)
        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' } 
        )

        console.log("A10 " + token)
        res.json({
            user, 
            token
        })
    } catch(error) {
        console.log(error)
        return res.json({message: 'Нет доступа. ' + error})
    }
}