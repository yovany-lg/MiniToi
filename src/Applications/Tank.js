const mqtt = require('mqtt');
const MotorsModule = require('../../../robotois-motors-v2');
const { batteryMonitor } = require('../Modules/BatterySensor');

const client = mqtt.connect({ host: 'localhost' })
const Motors = new MotorsModule(0);
batteryMonitor();
const TOPIC_DRIVE_VECTOR = 'tois/SuperToi123/RealTime/driveVector';
const TOPIC_DRIVE = 'tois/SuperToi123/RealTime/drive';
const ratio = (4095 / 100) * 0.75;

client.on('connect', () => {
  console.log('Connected to Broker');
  client.subscribe(TOPIC_DRIVE_VECTOR);
  client.subscribe(TOPIC_DRIVE);
});

client.on('message', (topic, message) => {
  switch(topic) {
    case TOPIC_DRIVE_VECTOR:
      drive(message);
      break;
      case TOPIC_DRIVE:
        drive(message);
        // setSpeed(message);
      break;
  }
});

// function transformCoords({ x, y }) {
//   const motors = {
//     motor1: 0,
//     motor2: 0,
//   };
//   if (y === 0) {
//     motors.motor1 = -x;
//     motors.motor2 = -x;
//     return motors;
//   }
//   motors.motor1 = -y;
//   motors.motor2 = y;
//   if (x === 0) {
//     return motors;
//   }
//   if (y > 0) {
//     if (x > 0) {
//       motors.motor2 = y - x;
//     }
//     if (x < 0) {
//       motors.motor1 = -y - x;
//     }
//   } else {
//     if (x > 0) {
//       motors.motor2 = y + x;
//     }
//     if (x < 0) {
//       motors.motor1 = -y + x;
//     }
//   }
//   return motors;
// }

function drive(message) {
  try {
    const coords = JSON.parse(message.toString());
    // const motorsSpeed = transformCoords(coords);
    // console.log(coords);
    Motors.drive(coords.x * ratio, coords.y * ratio, 0);
  } catch (error) {
    console.log('Sorry, there was an error', error);
  }
}

function setSpeed(message) {
  try {
    console.log(message.toString());
    const { motor1, motor2 } = JSON.parse(message.toString());
    Motors.motorsSpeed({ motor1, motor2 });    
  } catch (error) {
    console.log('Sorry, there was an error', error);
  }  
}