const uploadImage = require('../helpers/helpers.js');
const sellerModel = require('../models/sellerModel');

const updateProfilePhoto = async (req, res) => {
  const number = req.user.number; // mengambil nomor seller dari token yang telah didekodekan
  const newPhoto = req.file;

  if (!newPhoto) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Handling image upload
  let imageUrl = '';
  try {
    imageUrl = await uploadImage(newPhoto, 'seller_photos'); // folder "seller_photos" di GCP bucket
  } catch (error) {
    return res.status(500).json({ message: 'Upload fail', error: error.message });
  }

  // Insert image URL into database
  try {
    await sellerModel.updateSellerPhoto(number, imageUrl);
    return res.status(200).json({ message: 'Upload success', imageUrl: imageUrl });
  } catch (error) {
    return res.status(500).json({ message: 'Database update fail', error: error.message });
  }
};

module.exports = {
  updateProfilePhoto,
};
