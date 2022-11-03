require('dotenv').config();
var express = require('express');
var router = express.Router();
const https = require('https')
var ip = require("ip");

var app = express()
const port = 50000

app.listen(
  port, ip.address(),
  () => console.log(`API started\nListening on http://${ip.address()}:${port}`)
)
module.exports = router;

app.use(express.json())


// ROS INTEGRATION
const rclnodejs = require('rclnodejs');

const nodeName = 'api_node'
var node
var motor

rclnodejs.init()
.then(() => {
  console.log('[ROS2] Connection Successful')

  // this creates a new node, has the node every second publish to 

  // creates new node
  node = new rclnodejs.Node(nodeName) 

  // creates a publisher
  const msgType = 'uxa_sam_msgs/msg/PositionMove'
  const topic = 'sam_driver_position_move'
  motor = node.createPublisher(msgType, topic)
  motion = node,createPublisher("uxa_sam_mgs/msg/Motion", "uic_driver_motion")
  
  
  // runs the node
  node.spinOnce()

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
  
  let msg = {id: parseInt(id), pos: parseInt(position), torqlevel: 1} // `{id: ${id}, pos14: ${position}}`

  console.log(msg)

  motor.publish(msg);

  node.spinOnce()

  motor_data = {
    id: id,
    position: position
  }

  res.status(200).send(api_response)
})


app.get('/motion/:name', async (req, res) => {

  let name = req.params.name

  api_response = `Motion ID: ${name}`
  
  let msg = { motion_name: name } // `{id: ${id}, pos14: ${position}}`

  console.log(msg)

  publisher.publish(msg);

  node.spinOnce()

  motor_data = {
    id: id,
    position: position
  }

  res.status(200).send(api_response)
})