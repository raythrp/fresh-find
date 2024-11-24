const helpers = require('../helpers/helpers.js');
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
    imageUrl = await helpers.uploadImage(newPhoto, 'seller_photos'); // folder "seller_photos" di GCP bucket
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Upload fail', imageUrl: imageUrl });
  }

  // Insert image URL into database
  try {
    await sellerModel.updateSellerPhoto(number, imageUrl);
    return res.status(200).json({ message: 'Upload success', imageUrl: imageUrl });
  } catch {
    return res.status(500).json({ message: 'Database update fail' });
  }
};

const updateSellerDetails = async (req, res) => {
  const number = req.user.number; // Mengambil seller_id dari token
  const { store_name, email, address_number, address_street, address_city, address_village, address_subdistrict, address_province, address_code, bank_account, bank_name } = req.body;

  try {
      const result = await sellerModel.updateSellerDetails(number, store_name, email, address_number, address_street, address_city, address_village, address_subdistrict, address_province, address_code, bank_account, bank_name);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Seller not found' });
      }
      res.status(200).json({ message: 'Seller details updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update seller details' });
  }
};

module.exports = {
  updateProfilePhoto,
  updateSellerDetails
};
