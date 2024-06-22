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

exports.delete = (stoneId) => Stone.findByIdAndDelete(stoneId);

exports.edit = (stoneId, stoneData) => Stone.findByIdAndUpdate(stoneId, stoneData, {runValidators: true});

exports.getAll = () => Stone.find();

exports.getLatest = () => Stone.find().sort({createdAt: -1}).limit(3);

exports.getOne = (stoneId) => Stone.findById(stoneId);

exports.getOneWithOwner = (stoneId) => this.getOne(stoneId).populate('owner').populate('signUpList');

exports.like = async (stoneId, userId) => {
    await Stone.findByIdAndUpdate(stoneId, {$push: {likedList: userId}});
    await User.findByIdAndUpdate(userId, {$push: {likedStones: stoneId}});
};

exports.search = (name) => {
    let query = {};

    if(name){
        query.name = new RegExp(name, 'i');
    }
    return Stone.find(query);
}