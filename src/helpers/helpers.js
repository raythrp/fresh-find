const gc = require('../config/storage.js');
const bucket = gc.bucket('fresh_find') // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file, folder) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  const blob = bucket.file(`${folder}/${originalname.replace(/ /g, "_")}`)
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    resolve(publicUrl)
  })
  .on('error', (error) => {
    reject(`Unable to upload image, something went wrong. ${error}`)
  })
  .end(buffer)
});

const getFormattedTimestamp = () => {
  const now = new Date();

  const pad = num => String(num).padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const timezoneOffset = -now.getTimezoneOffset();
  const sign = timezoneOffset >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
  const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${sign}${offsetHours}${offsetMinutes}`;
};


// To get Jakarta Time
const getLocalTime = () => {
  const now = new Date();

  const options = { timeZone: 'Asia/Jakarta', hour12: false };
  const year = now.toLocaleString('en-GB', { ...options, year: 'numeric' });
  const month = now.toLocaleString('en-GB', { ...options, month: '2-digit' });
  const day = now.toLocaleString('en-GB', { ...options, day: '2-digit' });
  const hours = now.toLocaleString('en-GB', { ...options, hour: '2-digit' });
  const minutes = now.toLocaleString('en-GB', { ...options, minute: '2-digit' });
  const seconds = now.toLocaleString('en-GB', { ...options, second: '2-digit' });

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// OTP mechanism
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSID = process.env.TWILIO_SERVICE_SID
const client = twilio(accountSid, authToken);

async function createVerification(number) {
  const verification = await client.verify.v2
    .services(serviceSID)
    .verifications.create({
      channel: "sms",
      to: `+${number}`,
    });

  return verification.status;
}

async function createVerificationCheck(number, code) {
  const verificationCheck = await client.verify.v2
    .services(serviceSID)
    .verificationChecks.create({
      code: `${code}`,
      to: `+${number}`,
    });

  return verificationCheck.status;
}


module.exports = {
  uploadImage,
  getFormattedTimestamp,
  getLocalTime,
  createVerification,
  createVerificationCheck
};