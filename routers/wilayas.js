const express = require('express');
const { Wilaya } = require('../models/wilaya');
const router = express.Router();


//get request for all properties in the bd
router.get('/', async (req, res) => {
    const wilayaList = await Wilaya.find();

    if(!wilayaList) {
        res.status(500).json({ sucess: false })
    };

    res.status(200).send(wilayaList);
})

// Get request for single wilaya
router.get('/:id', async (req, res) => {
    const wilaya = await Wilaya.findById(req.params.id);

    if(!wilaya) {
        res.status(500).json({ message: 'The wilaya doesnt exist'})
    }

    res.status(200).send(wilaya);
})

//Creating a wilaya and adding it to the db 
router.post('/', async (req, res) => {
    let wilaya = new Wilaya({
        name: req.body.name
    });

    wilaya = await wilaya.save();

    if(!wilaya) {
        return res.status(404).send('The wilaya was not created!');
    }

    res.send(wilaya);
})

// updating a specific wilaya 
router.put('/:id', async (req, res) => {
    const wilaya = await Wilaya.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name
        },
        { new: true }
    );

    if(!wilaya) {
        return res.status(400).send('the wilaya cannot be updated');
    }

    res.status(200).send(wilaya);
});

router.delete('/:id', (req, res) => {
    Wilaya.findByIdAndRemove(req.params.id).then(wilaya => {
        if(wilaya) {
            return res.status(200).json({ success: true, message: 'the wilaya was deleted.'})
        } else {
            return res.status(404).json.apply({success: false, message: "wilaya not found"})
        }
    }).catch( err => {
        return res.status(400).json({success: false, error: err });
    });

});


module.exports = router;
