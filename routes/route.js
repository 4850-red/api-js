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

const nodeName = 'api_node'

rclnodejs.init()
.then(() => {
  console.log('[ROS2] Connection Successful')

  // this creates a new node, has the node every second publish to 

  // creates new node
  const node = new rclnodejs.Node(nodeName) 

  // creates a publisher
  const msgType = 'std_msgs/msg/String'
  const topic = 'chatter'
  const publisher = node.createPublisher(msgType, topic)
  
  // just loop spamming messages 
  let counter = 0;
  setInterval(() => {

    let msg = `From API: Hello ROS2 ${counter++}`

    console.log(`Publishing message: ${msg}`);
    publisher.publish(msg);
  }, 1000);
  
  // runs the node
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


