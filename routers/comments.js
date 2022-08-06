const {Comment} = require('../models/comment');
const express = require('express');
const router = express.Router();


// get request for all comments in the db
router.get('/', async (req, res) => {
    const commentList = await Comment.find();

    if(!commentList) {
        res.status(500).json({ success: false});
    };

    res.status(200).send(commentList);
});

// Get comment using the name
router.get('/name/:name', async (req, res) => {
    const commentList = await Comment.find( { name: req.params.name });

    if(!commentList) {
        res.status(500).json({ sucess: false});
    };

    res.status(200).send(commentList);
});


// get request for single comment based on id parameter in the url
router.get('/:id', async(req, res) => {
    const comment = await Comment.findById(req.params.id);

    if(!comment) {
        res.status(500).json({ message: 'The comment with the given ID was not  found.'})
    }
    res.status(200).send(comment);
});

// creating a comment and adding it to the db
router.post('/', async (req, res) => {
    let comment = new Comment({
        username: req.body.username,
        email: req.body.email,
        comment: req.body.comment
    })
    comment = await comment.save();

    if(!comment){
        return res.status(404).send('The comment could not be created!');
    };

    res.send(comment);
});

// updating a specific comment 
router.put('/:id', async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(
        req.params.id, 
        {
            username: req.body.username,
            email: req.body.email,
            comment: req.body.comment
        },
        { new: true }
    );

    if(!comment) {
        return res.status(400).send('the comment cannot be updated');
    }

    res.status(200).send(comment);
});

// deleting a specific comment
router.delete('/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id).then(comment => {
        if(comment) {
            return res.status(200).json({ success: true, message: 'the comment was deleted.'})
        } else {
            return res.status(404).json.apply({success: false, message: "comment not found"})
        }
    }).catch( err => {
        return res.status(400).json({success: false, error: err });
    });

});

module.exports = router;