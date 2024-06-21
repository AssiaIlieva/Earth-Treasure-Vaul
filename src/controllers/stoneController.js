const { isAuth } = require('../middlewares/authMiddlware');
const stoneService = require('../services/stoneService');
const {getErrorMessage} = require('../utils/errorUtils');

const router = require('express').Router();

router.get('/create', isAuth, (req, res) => {
    res.render('stones/create')
});

router.post('/create', isAuth, async (req, res) => {
    const stoneData = req.body;
    try {
        await stoneService.create(req.user._id, stoneData);
        res.redirect('/stones')
    } catch (error) {
        const message = getErrorMessage(error);
        res.render('stones/create', {...stoneData, error: message})
    };
});

router.get('/', async (req, res) => {
    const stones = await stoneService.getAll().lean();
    res.render('stones/catalog', {stones});
  });

router.get('/:stoneId/details', async (req, res) => {
    const stone = await stoneService.getOne(req.params.stoneId).lean();
    const isOwner = stone.owner == req.user?._id;
    const isLiked = stone.likedList.some(user => user._id == req.user?._id);
    console.log(isOwner, isLiked);
    res.render('stones/details', {...stone, isOwner, isLiked})
});
module.exports = router;