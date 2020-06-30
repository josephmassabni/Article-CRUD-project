let mongoose = require('mongoose');

//Schema for Article
let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);

//Initial ArrayList, what the Schema is like
/*
 let articles = [
        { 
        id: 1,
        title: 'Article One',
        author: 'Buttchin',
        body: 'This is article one.'
        },
        { 
        id: 2,
        title: 'Article Two',
        author: 'Jimmy',
        body: 'This is article two.'
        },
        { 
        id: 3,
        title: 'Article Three',
        author: 'Steve',
        body: 'This is article three.'
        }
    ]
*/