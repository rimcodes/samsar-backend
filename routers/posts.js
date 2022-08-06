const {Post} = require('../models/post');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if(isValid) {
        uploadError = null;
    };

    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {

    const fileName = file.originalname.split(' ').join('-');
    const extention = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extention}`)
  }
})

const uploadOptions = multer({ storage: storage })

// get request for all posts in the db
router.get('/', async (req, res) => {
    let postList;

    let filter = {};
    if(req.query.topics) {
        filter = { topics: req.query.topics.split(',') };
    }

    try {
        postList = await Post.find(filter);
        
    } catch (error) {
        console.log("Erro loged in the console: ", error);
        
    }

    if(!postList) {
        res.status(500).json({ success: false});
    };

    res.status(200).send(postList);
});

// Get post using the name
router.get('/slug/:name', async (req, res) => {
    const postList = await Post.find( { name: req.params.name });

    if(!postList) {
        res.status(500).json({ sucess: false});
    };

    res.status(200).send(postList);
});


// get request for single post based on id parameter in the url
router.get('/:id', async(req, res) => {
    const post = await Post.findById(req.params.id);

    if(!post) {
        res.status(500).json({ message: 'The post with the given ID was not  found.'})
    }
    res.status(200).send(post);
});

// creating a post and adding it to the db
router.post('/', uploadOptions.single('image'), async (req, res) => {
    // Making sure the topic exists
    const topic = await Topic.findById(req.body.topic);
    if(!topic) return res.status(400).send('Invalid topic');

    // Making sure the request has a file path in it
    const file = req.file;
    if(!file) return res.status(400).send('No image in request');

    const fileName = req.file.filename;
    const basePath = `https://rimcode-rimmart-backend.herokuapp.com/public/uploads/`;
    
    let post = new Post({
        name: req.body.name,
        image: `${basePath}${fileName}`,
        body: req.body.body
    })
    post = await post.save();

    if(!post){
        return res.status(404).send('The post could not be created!');
    };

    res.send(post);
});

// updating a specific post 
router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid post id');
    }

    const post = await Post.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name,
            body: req.body.body
        },
        { new: true }
    );

    if(!post) {
        return res.status(400).send('the post cannot be updated');
    }

    res.status(200).send(post);
});

// deleting a specific post
router.delete('/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id).then(post => {
        if(post) {
            return res.status(200).json({ success: true, message: 'the post was deleted.'})
        } else {
            return res.status(404).json.apply({success: false, message: "post not found"})
        }
    }).catch( err => {
        return res.status(400).json({success: false, error: err });
    });

});

module.exports = router;