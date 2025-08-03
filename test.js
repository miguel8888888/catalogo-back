require('dotenv').config();
const handler = require('./api/registros');

handler({}, {
  status: (code) => ({
    json: (body) => console.log('Response:', code, body),
  }),
});
