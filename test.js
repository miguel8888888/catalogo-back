require('dotenv').config();
const handler = require('./api/index');

const fakeRes = {
  setHeader: (name, value) => console.log(`Header: ${name} = ${value}`),
  status: (code) => {
    console.log(`Status: ${code}`);
    return {
      json: (body) => console.log('Response:', body)
    };
  },
  end: () => console.log('Response ended')
};

handler({}, fakeRes);
