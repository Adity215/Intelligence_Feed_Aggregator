const express = require('express');
const router = express.Router();
const aiSummaries = require('../data/aiSummaries');

router.get('/', (req, res) => {
    res.json(aiSummaries);
});

module.exports = router;
