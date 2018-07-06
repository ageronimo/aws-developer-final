const express = require('express');
const router = express.Router(); 
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json')
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const sns = new AWS.SNS({apiVersion: '2010-03-31'});
require('dotenv').config();

//CONFIRM ORDER THROUGH SNS
function sendOrderStatus() {
	let smsParams = {
		Message: "Your order has been confirmed and is now being processed. Mahalo for shopping at Surf's Up!",
		TopicArn: "arn:aws:sns:us-west-2:482923922975:surf-orders"
	}

	sns.publish(smsParams, (err, data) => {
		if (err) {
			console.log(`Error in sending status: ${err}`);
		} else {
			console.log('Confirmation sent');
		}
	})
}

//ROUTE AND GET/POST REQUESTS
router.route('/new-order')
    .get((req, res) => {
        res.render('../views/new-order')
    })
    .post((req, res) => {
    	console.log(req.body.order);
    	let msgParams = {
			QueueUrl: process.env.QUEUE_URL,
			MessageBody: req.body.order,
			DelaySeconds: 0,
		};

		sqs.sendMessage(msgParams, (err, data) => {
			if (err) {
				console.log(`Error in sending message: ${err}`);
			} else {
				console.log(`Message sent: ${msgParams.MessageBody}`);
				sendOrderStatus();
			}
		});
		res.render('../views/home');
    })

module.exports = router;