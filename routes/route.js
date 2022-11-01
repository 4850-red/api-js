require('dotenv').config();
var express = require('express');
var router = express.Router();
const https = require('https')
var ip = require("ip");

var app = express()
const port = 80

app.listen(
  port, ip.address(),
  () => console.log(`twichat API started\nListening on http://${ip.address()}:${port}`)
)
module.exports = router;

app.use(express.json())


// ROS INTEGRATION
const rosnodejs = require('rosnodejs');

var nh

// starts node connection to ros
rosnodejs.initNode('/red')
// rosnodejs.initNode('/red', { onTheFly: true })
.then(() => {
  console.log(' >> [ROS] Connection Successful')
  nh = rosnodejs.nh
})
.catch(() => {
  console.log(' >> [ROS] Connection Failed')
})

const StringMsg = rosnodejs.require('std_msgs').msg.String;

// motor test
app.get('/motor/:id/:position', async (req, res) => {

  let id = req.params.id 
  let position = req.params.position

  api_response = `Motor: ${id}, Position: ${position}`

  motor_data = {
    id: id,
    position: position
  }

  const pub = nh.advertise('/motor', StringMsg);

  pub.publish(motor_data);

  res.status(200).send(api_response)
})


