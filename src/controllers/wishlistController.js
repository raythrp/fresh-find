const wishlistModel = require('../models/wishlistModel.js');

const showWishlist = async (req, res) => {
  try {
    const number = req.user.number;
    const responseData = await wishlistModel.getUserWishlist(number);
    return res.status(200).json({ 
      message: 'Success',
      data: responseData
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Wishlist retrieval fail' });
  }
};

const addToWishList = async (req, res) => {
  try {
    const number = req.user.number;
    const { id } = req.body;

    const verified = await wishlistModel.checkWish(number, id)
    if (verified[0].length === 0) {
      await wishlistModel.createWish(number, id);
      return res.status(200).json({ message: 'Success' });
    }
    return res.status(409).json({ message: 'Wish exists'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Wishlist adding fail' });
  }
};

const deleteFromWishlist = async (req, res) => {
  try {
    const number = req.user.number;
    const { id } = req.body;

    const verified = await wishlistModel.checkWish(number, id);
    if (verified[0].length === 0) {
      return res.status(404).json({ message: 'Wish not found' });
    }

    await wishlistModel.deleteWish(number, id);
    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Wishlist deleting fail' });
  }
};

module.exports = {
  addToWishList,
  deleteFromWishlist,
  showWishlist
}