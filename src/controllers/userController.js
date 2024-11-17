const uploadImage = require('../helpers/helpers.js');
const userModel = require('../models/userModel');

const updateProfilePhoto = async (req, res) => {
  const number = req.user.number;
  const newPhoto = req.file;

  if(!newPhoto) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Handling image upload
  let imageUrl = '' 
  try {
    imageUrl = await uploadImage(newPhoto,'customer_photos');
  } catch (error) {
    return res.status(500).json({ message: 'Upload fail', imageUrl: imageUrl });
  }

  // Insert image URL to database
  try {
    const responseData = await userModel.updateUserPhoto(number, imageUrl);
    return res.status(200).json({ message: 'Upload success', imageUrl: imageUrl});
  } catch {
    return res.status(500).json({ message: 'Database update fail' });
  }
}

module.exports = {
  updateProfilePhoto
}