const express = require('express');
const router = express.Router(); 
const bodyParser = require('body-parser');

//ROUTE
router.route('/confirm-order')
	.get((req, res) => {
		res.render('../views/confirm-order')
	})

module.exports = router;