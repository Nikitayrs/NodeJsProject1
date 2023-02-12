import mongoose, { mongo } from 'mongoose'

const PostSchema = new mongoose.Schema({
    username: {type: String },
    title: {type: String, required: true},
    text: {type: String, required: true},
    imgUrl: {type: String, default: ''},
    views: {type: Number, dafault: 0},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    },
    {timestapms: true},
)
export default mongoose.model('Post', PostSchema)

// CREATE TABLE IF NOT EXISTS post (id INTEGER NOT NULL primary key, username VARCHAR(255) NOT NULL, text VARCHAR(255) NOT NULL, 
// imgUrl VARCHAR(255) default '', views INTEGER default 0, author INTEGER NOT NULL references user(id),
// comments INTEGER NULL references user(id)

// FOREIGN KEY (author) references user(id),
// FOREIGN KEY (comments) references user(id)
// ))

// CREATE TABLE `users` (
//     `id` INT NOT NULL AUTO_INCREMENT ,
//     `email` VARCHAR(255) NOT NULL ,
//     `name` VARCHAR(255) NOT NULL ,
//     PRIMARY KEY (`id`),
//     UNIQUE (`email`)
//    )