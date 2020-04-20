var rpio = require('rpio');
const command = require('../../commands');

const batteryType = '2S_TYPE';
const maxLevel = (4.2 * 2) / 3;
const minLevel = (3.1 * 2) / 3;

function batteryMonitor() {
  rpio.i2cBegin();
  rpio.i2cSetSlaveAddress(0x4D);
  rpio.i2cSetBaudRate(10000);
  const readBuf = Buffer.alloc(2);
  const data = new Array(3);
  const currentLevel = read();
  data[0] = currentLevel;
  data[1] = currentLevel;
  data[2] = currentLevel;
  let average = 0;
  setInterval(() => {
    const level = read();
    data.push(level);
    data.shift();
    average = 0;
    for(let i = 0; i < 3; i++) {
      average += data[i];
    }
    average = average / 3;
    // console.log({ average, level, data });
    if (average <= minLevel) {
      command('sudo shutdown -h now');
    }
  }, 5000);
  function read() {
    rpio.i2cRead(readBuf, 2);
    const byte1 = readBuf[0] << 6;
    const byte2 = readBuf[1] >> 2;
    const result = (byte1 | byte2) * (5 / 1023);
    // console.log({ byte: byte1 | byte2, result });
    return result;
    // rpio.i2cEnd();
  }
}

// setInterval(() => {
//   const level = read();
//   data.shift();
//   data.push(level);
//   let average = 0;
//   for(let i = 0; i < 3; i++) {
//     average += data[i];
//   }
//   average = average / 3;
//   console.log({ average, level, data });
//   if (average <= minLevel) {
//     // command('sudo shutdown -h now');
//   }
// }, 1000);
// read();

process.on('SIGINT', () => {
  rpio.i2cEnd();
});

process.on('SIGTERM', () => {
  rpio.i2cEnd();
});

module.exports = {
  batteryMonitor,
};
