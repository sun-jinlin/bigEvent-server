const express = require('express');
const router = express.Router();


router.get('/userinfo', async (req, res) => {
    console.log(req.user);
})

module.exports = router;