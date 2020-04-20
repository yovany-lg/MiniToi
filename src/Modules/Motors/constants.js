const SLAVE_ADDRESS = 0x10;
const MOTORS_M1_SPEED_REGISTER = 0x07 // Address of the lower byte for PID (RPM) controller
const FRAME_TAIL = 0xFF;

module.exports = {
  MOTORS_M1_SPEED_REGISTER,
  SLAVE_ADDRESS,
  FRAME_TAIL,
}