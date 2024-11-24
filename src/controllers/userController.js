const helpers = require('../helpers/helpers.js');
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
    imageUrl = await helpers.uploadImage(newPhoto,'customer_photos');
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
};

const updateUserDetails = async (req, res) => {
  const number = req.user.number; // Mengambil user_id dari token
  const { name, email, address_number, address_street, address_city, address_village, address_subdistrict, address_province, address_code } = req.body;

  try {
      const result = await userModel.updateUserDetails(number, name, email, address_number, address_street, address_city, address_village, address_subdistrict, address_province, address_code);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update user details' });
  }
};

module.exports = {
  updateProfilePhoto,
  updateUserDetails
}