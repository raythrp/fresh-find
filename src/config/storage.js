const Cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, '../../bucket-keys.json');

const { Storage } = Cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.PROJECT_ID
});

module.exports = storage;