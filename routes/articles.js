const express = require('express');
const router = express.Router();

//Article Model
let Article = require('../models/article');
//User Model
let User = require('../models/user');

//Add Route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_article', {
        title: 'Add Article'
    });
});

//Submit POST Route
router.post('/add', function(req, res){
    req.checkBody('title', 'Title required.').notEmpty();
    //req.checkBody('author', 'Author required.').notEmpty();
    req.checkBody('body', 'Body required.').notEmpty();
    //get errors
    let errors = req.validationErrors();
    if(errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        })
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;
     
        article.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }
});


//Load Edit Form
router.get('/edit/:id', function(req,res){
    Article.findById(req.params.id, function(err, article){
        if(article.author == req.user._id) {
            res.render('edit_article', {
                title: 'Edit Article',
                article: article
            });
        } else {
            req.flash('danger', 'You must be the author to edit this article.');
            res.redirect('/'); 
        }
    });
});

//Edit POST Route
router.post('/edit/:id', ensureAuthenticated, function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id: req.params.id};

    Article.update(query, article, function(err){
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Updated')
            res.redirect('/');
        }
    });
});

router.delete('/:id', function(req, res){
    if(!req.user.id) {
        res.status(500).send();
    }

    let query = {_id: req.params.id}

    Article.findById(req.params.id, function(err, article){
        if(article.author != req.user._id){
            res.status(500).send();
        } else {
            Article.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

//Single Article Route
//Called last because thinks add = id (articles/add = articles/:id)
router.get('/:id', function(req, res){

    Article.findById(req.params.id, function(err, article){
        User.findById(article.author, function(err, user){
            res.render('article', {
                article: article,
                author: user.name
            });
        });
    });
});

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Log in or register to add or edit an article.');
        res.redirect('/users/login');
    }
}
module.exports = router;
