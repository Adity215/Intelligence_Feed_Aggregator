const express = require('express');
const router = express.Router();
const feeds = require('../data/feeds');

router.get('/', (req, res) => {
    res.json(feeds);
});

module.exports = router;
