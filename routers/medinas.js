const express = require('express');
const { Medina } = require('../models/medina');
const router = express.Router();


//get request for all properties in the bd
router.get('/', async (req, res) => {
    const medinasList = await Medina.find();

    if(!medinasList) {
        res.status(500).json({ sucess: false })
    };

    res.status(200).send(medinasList);
})

module.exports = router;
