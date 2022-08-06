const { Mogata } = require('../models/mogata');
const express = require('express');
const router = express.Router();


//get request for all properties in the bd
router.get('/', async (req, res) => {
    const mogataList = await Mogata.find().populate('wilaya');

    if(!mogataList) {
        res.status(500).json({ sucess: false })
    };

    res.status(200).send(mogataList);
});

// Get request for single mogata
router.get('/:id', async (req, res) => {
    const mogata = await Mogata.findById(req.params.id).populate('wilaya');

    if(!mogata) {
        res.status(500).json({ message: 'The mogata doesnt exist'})
    }

    res.status(200).send(mogata);
});

// Get category using the name
router.get('/name/:name', async (req, res) => {
    const mogataList = await Mogata.find( { name: req.params.name });

    if(!mogataList) {
        res.status(500).json({ sucess: false});
    };

    res.status(200).send(mogataList);
});


//Creating a mogata and adding it to the db 
router.post('/', async (req, res) => {
    let mogata = new Mogata({
        name: req.body.name,
        wilaya: req.body.wilaya
    });

    mogata = await mogata.save();

    if(!mogata) {
        return res.status(404).send('The mogata was not created!');
    }

    res.send(mogata);
});

// updating a specific mogata 
router.put('/:id', async (req, res) => {
    const mogata = await Mogata.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name,
            wilaya: req.body.wilaya

        },
        { new: true }
    );

    if(!mogata) {
        return res.status(400).send('the mogata cannot be updated');
    }

    res.status(200).send(mogata);
});

router.delete('/:id', (req, res) => {
    Mogata.findByIdAndRemove(req.params.id).then(mogata => {
        if(mogata) {
            return res.status(200).json({ success: true, message: 'the mogata was deleted.'})
        } else {
            return res.status(404).json.apply({success: false, message: "mogata not found"})
        }
    }).catch( err => {
        return res.status(400).json({success: false, error: err });
    });

});

module.exports = router;
