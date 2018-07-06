const express = require('express');
const router = express.Router(); 
const bodyParser = require('body-parser');


router.route('/')
    .get((req, res) => {
        res.render('../views/home') //when someone "gets" home pg, only renders home page
    })

module.exports = router;
console.log('the route works');