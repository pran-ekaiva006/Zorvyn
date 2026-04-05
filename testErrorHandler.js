const AppError = require('./src/utils/AppError');
const errorHandler = require('./src/middlewares/errorHandler');

const err = new AppError('Test error', 400);

const req = {};
const res = {
  status: function(code) {
    console.log('Status set to:', code);
    return this;
  },
  json: function(data) {
    console.log('Sent JSON:', data);
  }
};

errorHandler(err, req, res, () => {});
