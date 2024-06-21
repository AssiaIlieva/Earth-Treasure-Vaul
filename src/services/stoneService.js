const Stone = require('../models/Stone');
const User = require('../models/User');


exports.create = async (userId, stoneData) => {
    const createdStone = await Stone.create({
        owner: userId,
        ...stoneData
    });
    
    await User.findByIdAndUpdate(userId, {$push: {createdStones: createdStone._id}});
    return createdStone;
};

exports.getAll = () => Stone.find();exports.getLatest = () => Stone.find().sort({createdAt: -1}).limit(3);
exports.getOne = (stoneId) => Stone.findById(stoneId);
