var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    if (req.method === "GET") {
        // Continue to next middleware or req handler
        return next();
    }

    console.log('IsAuthenticated:', req.isAuthenticated());

    if (!req.isAuthenticated()) {
        // not authenticated user redirected to login
        return res.redirect('/#login');
    }

    // user authenticated continue tu next middleware or handler
    return next();
});
router.route('/posts')

    // returns all posts
    .get(function (req, res) {
        // workaround
        res.send({ message: 'TODO return all posts' });
    })

    // create a post
    .post(function (req, res) {
        // workaround
        res.send({ message: 'TODO create a new post' });
    });

router.route('/posts/:id')

    //returns a particualr post
    .get(function (req, res) {
        res.send({ message: 'TODO return post with ID ' + req.params.id })
    })

    // update existing post
    .put(function (req, res) {
        res.send({ message: 'TODO modify post with ID ' + req.params.id })
    })

    // delete existing post
    .delete(function (req, res) {
        res.send({ message: 'TODO delete post with ID ' + req.params.id })
    })

module.exports = router;
