const Express = require('express')
const logger = require('morgan')
const command = require('./commands')
require('./Applications/Tank')

const app = new Express()

app.use(logger('tiny'))

app.get('/health', (req, res) => {
  res.status(200).json({
    toi: 'SuperToi',
  });
});

app.get('/shutdown', (req, res) => {
  console.log('---> Robotois system going to shutdown...')
  res.status(200).json({
    ok: 'ok',
  });
  setTimeout(() => {
    command('sudo shutdown -h now');
  }, 1000);
});

app.listen(8082);
console.log('listening on port 8082')
