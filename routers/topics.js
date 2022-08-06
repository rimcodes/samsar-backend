const {Topic} = require('../models/topic');
const express = require('express');
const router = express.Router();


// get request for all categories in the db
router.get('/', async (req, res) => {
    const topicList = await Topic.find();

    if(!topicList) {
        res.status(500).json({ success: false});
    };

    res.status(200).send(topicList);
});

// Get topic using the name
router.get('/name/:name', async (req, res) => {
    const topicList = await Topic.find( { name: req.params.name });

    if(!topicList) {
        res.status(500).json({ sucess: false});
    };

    res.status(200).send(topicList);
});


// get request for single topic based on id parameter in the url
router.get('/:id', async(req, res) => {
    const topic = await Topic.findById(req.params.id);

    if(!topic) {
        res.status(500).json({ message: 'The topic with the given ID was not  found.'})
    }
    res.status(200).send(topic);
});

// creating a topic and adding it to the db
router.post('/', async (req, res) => {
    let topic = new Topic({
        name: req.body.name
    })
    topic = await topic.save();

    if(!topic){
        return res.status(404).send('The topic could not be created!');
    };

    res.send(topic);
});

// updating a specific topic 
router.put('/:id', async (req, res) => {
    const topic = await Topic.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name
        },
        { new: true }
    );

    if(!topic) {
        return res.status(400).send('the topic cannot be updated');
    }

    res.status(200).send(topic);
});

// deleting a specific topic
router.delete('/:id', (req, res) => {
    Topic.findByIdAndRemove(req.params.id).then(topic => {
        if(topic) {
            return res.status(200).json({ success: true, message: 'the topic was deleted.'})
        } else {
            return res.status(404).json.apply({success: false, message: "topic not found"})
        }
    }).catch( err => {
        return res.status(400).json({success: false, error: err });
    });

});

module.exports = router;