var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

router.use(function (req, res, next) {

    // Continue to next middleware or req handler
    if (req.method === "GET") {
        return next();
    }

    console.log('IsAuthenticated:', req.isAuthenticated());

    // not authenticated user redirected to login
    if (!req.isAuthenticated()) {
        return res.redirect('/#login');
    }

    // user authenticated continue tu next middleware or handler
    return next();
});

router.route('/posts')

    // returns all posts
    .get(function (req, res) {
        Post.find(function (err, data) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(data);
        });
    })

    // create a post
    .post(function (req, res) {
        var post = new Post();
        post.text = req.body.text;
        post.created_by = req.body.created_by;
        post.save(function (err, post) {
            if (err) {
                return res.send(500, err);
            }
            return res.json(post);
        });
    });

router.route('/posts/:id')

    //returns a particualr post
    .get(function (req, res) {
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                res.send(err);
            }
            res.json(post);
        });
    })

    // update existing post
    .put(function (req, res) {
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                res.send(err);
            }
            post.created_by = req.body.created_by;
            post.text = req.body.text;
            post.save(function (err, post) {
                if (err) {
                    req.send(err);
                }
                req.json(post);
            });
        });
    })

    // delete existing post
    .delete(function (req, res) {
        Post.remove({ _id: req.params.id }, function (err) {
            if (err) {
                res.send(err);
            }
            res.json('Deleted : (');
        });
    });

module.exports = router;
