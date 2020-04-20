const crc = require('crc');
const rpio = require('rpio');

rpio.i2cBegin();
rpio.i2cSetSlaveAddress(0x40);
rpio.i2cSetBaudRate(100000);
const writeArray = new Uint8Array();


function Motors() {

  const dataArray = new Uint8Array(5);
  const finalArray = new Uint8Array(9);
  const finalBuffer = Buffer.from(finalArray.buffer);

  const motorsSpeed = ({ motor1, motor2 }) => {
    dataArray[0] = MOTORS_M1_SPEED_REGISTER;
    dataArray[1] = 0xFF & motor1;
    dataArray[2] = 0xFF & (motor1 >> 8);
    dataArray[3] = 0xFF & motor2;
    dataArray[4] = 0xFF & (motor2 >> 8);
    const calcCrc = crc.crc16(dataArray);
    finalArray[0] =  dataArray[0];
    finalArray[1] =  dataArray[1];
    finalArray[2] =  dataArray[2];
    finalArray[3] =  dataArray[3];
    finalArray[4] =  dataArray[4];
    finalArray[5] = 0xFF & calcCrc >> 8;
    finalArray[6] = 0xFF & calcCrc;
    finalArray[7] = FRAME_TAIL;
    finalArray[8] = FRAME_TAIL;
    // console.log({ finalBuffer });
    rpio.i2cWrite(finalBuffer);
  };
  const release = () => {
    rpio.i2cEnd();
  }
  return {
    motorsSpeed,
    release,
  }
}

module.exports = Motors;

// const motorsModule = Motors();

// motorsModule.motorsSpeed({
//   motor1: 0,
//   motor2: 200
// });
