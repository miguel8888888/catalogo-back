require('dotenv').config();
const handler = require('./api/index');

handler({}, {
  status: (code) => ({
    json: (body) => console.log('Response:', code, body),
  }),
});
