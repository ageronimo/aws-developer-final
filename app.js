const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json')
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const path = require('path');
const home = require('./routes/home')
const newOrder = require('./routes/new-order')
const confirmOrder = require('./routes/confirm-order')

app.use(bodyParser.urlencoded({extended:true}))
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(express.static('images'))

app.set('view engine', '.hbs');

app.engine('.hbs', exphbs({
  extname:'.hbs',
  defaultLayout:'main',
}))

app.use('/', home)
app.use('/', newOrder)
app.use('/', confirmOrder)

// CREATE QUEUE
function createQueue() {
	let qParams = {
		QueueName: 'surfboard-order-queue',
		Attributes: {
			'DelaySeconds': '5',
			'MessageRetentionPeriod': '86400'
		}
	};

	sqs.createQueue(qParams, (err, data) => {
		if (err) {
			console.log(`Error in creating queue: ${err}`);
		} else {
			console.log(`Queue creation succeeded: ${data.QueueUrl}`);
		}
	});
}
createQueue();

app.listen(PORT, () => {
    console.log(`Server started, listening on ${PORT}`);
})
