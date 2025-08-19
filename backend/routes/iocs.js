const express = require('express');
const router = express.Router();
const iocs = require('../data/iocs');

router.get('/', (req, res) => {
    res.json(iocs);
});

module.exports = router;
