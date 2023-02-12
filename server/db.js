// import sqlite3 from 'sqlite3'
// sqlite3.verbose()
// //const sqlite3 = require('sqlite3').verbose()
// const dbName = 'later.sqlite'
// const db = new sqlite3.Database(dbName)

// db.serialize(() => {
//     const sql = `
//     CREATE TABLE IF NOT EXISTS user
//         (id integer primary key, username VARCHAR(255) NOT NULL, password TEXT NOT NULL)
//     `
//     db.run(sql)
// })
//import { connect } from 'mongoose'
import mysql from 'mysql2'

const connection = mysql.createConnection({
    //connectionLimit: 100,
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'delete'
})
//.promise()

// тестирование подключения
// connection.connect(function(err){
//     if (err) {
//         return console.error("Ошибка: " + err.message)
//     }
//     else {
//         console.log("Подключение к серверу MySQL успешно установлено")
//     }
// })

export class DB {
    static all(cb) {
        connection.query("SELECT * FROM user",
        function(err, results, fields) {
            console.log(err)
            console.log(results) // собственно данные
            console.log(fields) // мета-данные полей 
        })
        //connection.end();
    }
    static findOne(username, cb) {
        const user = [username];
        const sql = "SELECT * FROM user WHERE username = ?";
        connection.query(sql, user, function(err, results) {
            if(err) { 
                console.log('FIND ONE ' + err)
                return undefined
            }
            else {
                return results
            }
        })
        //connection.end();
    }
    static findById(userId, cb) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM user WHERE id = ?';
            console.log('findId1 ' + userId)
            try {
                connection.query(sql, userId, function(err, results) {
                    console.log('findId2')
                    if (err) {
                        console.log('FIND BY ID ' + err)
                        reject(undefined)
                    } else {
                        console.log('findId33 ' + results)
                        resolve(results)
                    }
                })
            } catch (e) {
                reject('FIND ERROR ' + e)
            }
        })
        //connection.end();
    }
    static findTilePost(title, cb) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM post WHERE title = ?';
            console.log('findTilePost11 ' + title)
            try {
                connection.query(sql, title, function(err, results) {
                    console.log('findIdPost')
                    if (err) {
                        console.log('findTilePost22 ' + err)
                        reject(undefined)
                    } else {
                        console.log('findTilePost33 ' + results)
                        resolve(results)
                    }
                })
            } catch (e) {
                reject('FIND ERROR ' + e)
            }
        })
        //connection.end();
    }
    static create(username, password, cb) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO user(username, password) VALUES(?, ?)`;
 
            const user = [username, password]
            connection.query(sql, user, function(err, results) {
                if(err) console.log(err)
            });
        })
        //connection.end();
    }
    static createPost(post, cb) {
        return new Promise((resolve, reject) => {
            console.log("createPost1")
            const sql = `INSERT INTO post (username, title, text, imgUrl, author, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
            let author = String(post.author)
            const data = [post.username, post.title, post.text, post.imgUrl, author]
            console.log("createPost2 " + data)
            try {
                connection.query(sql, data, function(err, result) {
                    if (err) {
                        console.log('CREATE POST ' + err)
                        //connection.destroy();
                        reject(false)
                    }
                    console.log("bbbbbbb")
                })
                resolve()
            } catch (e) {
                reject('CREATEPOST ' + e)
            }
        })
    }
    static async findByIdAndUpdate(id, posts, cb){
        return new Promise((resolve, reject) => {
            console.log('findByIdAndUpdate ' + id + ' a ' + posts.id)
            const sql = `UPDATE user SET posts=CONCAT(posts, ',' ,?) WHERE id=?`
            try {
                connection.query(sql, [posts.id, id], function(err, results) {
                    if (err) {
                        console.log('FIND BY ID AND UPDATE ' + err)
                        reject(false)
                    }
                    console.log('RESULTS ' + results)
                    resolve()
                })
            } catch (e) {
                reject(e)
            }
        })
    }
    static findSort(cb) {
        return new Promise((resolve, reject) => {
            console.log('findSort1')
            const sql = `SELECT * FROM post ORDER BY createdAt`
            try {
                connection.query(sql, function(err, results) {
                    if (err) {
                        console.log('findSort2' + err)
                        reject(false)
                    }
                    console.log('findSort3')
                    resolve(results)
                })
            } catch (e) {
                reject(e)
            }
        })
    }
    static findSortLimit(cb) {
        return new Promise((resolve, reject) => {
            console.log('findSortLimit1')
            const sql = `SELECT * FROM post ORDER BY views LIMIT 5`
            try {
                connection.query(sql, function(err, results) {
                    if (err) {
                        console.log('findSortLimit2 ' + err)
                        reject(false)
                    }
                    console.log('findSortLimit3 ' + results)
                    resolve(results)
                })
            } catch (e) {
                reject(e)
            }
        })
    }
    static UpdateViewPost(id, cb) {
        return new Promise((resolve, reject) => {
            console.log('UpdateViewPost1 ' + id)
            const sql = `UPDATE post set views = views + 1 WHERE id=?`
            try {
                connection.query(sql, id, function(err, results) {
                    if (err) {
                        console.log('UpdateViewPost2' + err)
                        reject(false)
                    }
                    console.log('UpdateViewPost3')
                    resolve()
                })
            } catch (e) {
                reject(e)
            }
        })
    }
    static PostUpdateView(id, cb) {
        return new Promise((resolve, reject) => {
            console.log('PostUpdateView1')
            const sql = `SELECT * FROM post WHERE id=?`
            try {
                connection.query(sql, id, function(err, results) {
                    if (err) {
                        console.log('PostUpdateView2' + err)
                        reject(false)
                    }
                    console.log('PostUpdateView3')
                    resolve(results)
                })
            } catch (e) {
                reject(e)
            }
        })
    }
    static findByIdAndDelete(id, cb) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE * FROM post WHERE id=?`
            try {
                connection.query(sql, id, function(err, results) {
                    if (err) {
                        console.log('findByIdAndDelete2' + err)
                        reject(false)
                    }
                    console.log('findByIdAndDelete3')
                    resolve()
                })
            } catch (e) {
                reject(e)
            }
        })
    }
}
//export {User}