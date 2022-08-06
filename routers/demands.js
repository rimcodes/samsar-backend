const {Demand} = require('../models/demand');
const { UserDemand } = require('../models/userdemand');
const express = require('express');
const router = express.Router();


// get request for all demands in the db
router.get('/', async (req, res) => {
    const demandList = await Demand.find();

    if(!demandList) {
        res.status(500).json({ success: false});
    };

    res.status(200).send(demandList);
});

// Get demand using the name
router.get('/name/:name', async (req, res) => {
    const demandList = await Demand.find( { name: req.params.name });

    if(!demandList) {
        res.status(500).json({ sucess: false});
    };

    res.status(200).send(demandList);
});

// Get users demand
router.get('/users', async (req, res) => {
    const demandList = await UserDemand.find();

    if(!demandList) {
        res.status(500).json({ success: false});
    };

    res.status(200).send(demandList);
});


// get request for single demand based on id parameter in the url
router.get('/:id', async(req, res) => {
    const demand = await Demand.findById(req.params.id);

    if(!demand) {
        res.status(500).json({ message: 'The demand with the given ID was not  found.'})
    }
    res.status(200).send(demand);
});

// get request for single user demand based on id parameter in the url
router.get('/users/:id', async(req, res) => {
    const demand = await UserDemand.findById(req.params.id);

    if(!demand) {
        res.status(500).json({ message: 'The demand with the given ID was not  found.'})
    }
    res.status(200).send(demand);
});

// creating a demand and adding it to the db
router.post('/', async (req, res) => {
    let demand = new Demand({
        title: req.body.title,
        body: req.body.body,
        phone: req.body.phone
    })
    demand = await demand.save();

    if(!demand){
        return res.status(404).send('The demand could not be created!');
    };

    res.send(demand);
});

// creating a user demand and adding it to the db
router.post('/users', async (req, res) => {
    let demand = new UserDemand({
        title: req.body.title,
        body: req.body.body,
        phone: req.body.phone
    })
    demand = await demand.save();

    if(!demand){
        return res.status(404).send('The demand could not be created!');
    };

    res.send(demand);
});

// creating a user demand and adding it to the db
router.post('/validate/:id', async (req, res) => {
    let userDemand = await UserDemand.findById(req.params.id);

    let demand = new Demand({
        title: userDemand.title,
        body: userDemand.body,
        phone: userDemand.phone
    })

    demand = await demand.save();
    
    if(!demand) {
        return res.status(400).send('the demand cannot be updated');
    }

    res.status(200).send(demand);
});

// updating a specific demand 
router.put('/:id', async (req, res) => {
    const demand = await Demand.findByIdAndUpdate(
        req.params.id, 
        {
            title: req.body.title,
            body: req.body.body,
            phone: req.body.phone
        },
        { new: true }
    );

    if(!demand) {
        return res.status(400).send('the demand cannot be updated');
    }

    res.status(200).send(demand);
});

// updating a specific demand 
router.put('/users/:id', async (req, res) => {
    const demand = await UserDemand.findByIdAndUpdate(
        req.params.id, 
        {
            title: req.body.title,
            body: req.body.body,
            phone: req.body.phone
        },
        { new: true }
    );

    if(!demand) {
        return res.status(400).send('the demand cannot be updated');
    }

    res.status(200).send(demand);
});

// deleting a specific demand
router.delete('/:id', (req, res) => {
    Demand.findByIdAndRemove(req.params.id).then(demand => {
        if(demand) {
            return res.status(200).json({ success: true, message: 'the demand was deleted.'})
        } else {
            return res.status(404).json.apply({success: false, message: "demand not found"})
        }
    }).catch( err => {
        return res.status(400).json({success: false, error: err });
    });

});
// deleting a specific demand
router.delete('/users/:id', (req, res) => {
    UserDemand.findByIdAndRemove(req.params.id).then(demand => {
        if(demand) {
            return res.status(200).json({ success: true, message: 'the demand was deleted.'})
        } else {
            return res.status(404).json.apply({success: false, message: "demand not found"})
        }
    }).catch( err => {
        return res.status(400).json({success: false, error: err });
    });

});

module.exports = router;