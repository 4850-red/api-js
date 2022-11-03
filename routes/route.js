require('dotenv').config();
var express = require('express');
var router = express.Router();
const https = require('https')
var ip = require("ip");

var app = express()
const port = 80

app.listen(
  port, ip.address(),
  () => console.log(`API started\nListening on http://${ip.address()}:${port}`)
)
module.exports = router;

app.use(express.json())


// ROS INTEGRATION
const rclnodejs = require('rclnodejs');

const nodeName = 'listener'

rclnodejs.init()
.then(() => {
  console.log('[ROS2] Connection Successful')
  const node = new rclnodejs.Node(nodeName)
  const publisher = node.createPublisher('std_msgs/msg/String', 'topic')
  publisher.publish(`Hello ROS 2 from rclnodejs`)
  node.spin()
})
.catch(err => {
  console.log('[ROS2] Connection Failed')
  console.error(err)
})


// motor test
app.get('/motor/:id/:position', async (req, res) => {

  let id = req.params.id 
  let position = req.params.position

  api_response = `Motor: ${id}, Position: ${position}`

  motor_data = {
    id: id,
    position: position
  }

  res.status(200).send(api_response)
})


