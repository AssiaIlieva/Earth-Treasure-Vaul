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
    res.render('stones/details', {...stone, isOwner, isLiked})
});

router.get('/:stoneId/like', async (req, res) => {
    await stoneService.like(req.params.stoneId, req.user._id);
    res.redirect(`/stones/${req.params.stoneId}/details`);
});

router.get('/:stoneId/edit', isStoneOwner, async (req, res) => {
    res.render('stones/edit', {...req.stone});
});

router.post('/:stoneId/edit', isStoneOwner, async(req, res) => {
    const stoneData = req.body;
    try {
        await stoneService.edit(req.params.stoneId, stoneData);
        res.redirect(`/stones/${req.params.stoneId}/details`)
    } catch (error) {
        res.render('stones/edit', {...stoneData, error: getErrorMessage(error)})
    }
});

router.get('/:stoneId/delete', isStoneOwner, async(req, res) => {
    await stoneService.delete(req.params.stoneId);
    res.redirect('/stones')
});

async function isStoneOwner(req, res, next) {
    const stone = await stoneService.getOne(req.params.stoneId).lean();
    if(stone.owner != req.user?._id) {
        return res.redirect(`/stones/${req.params.stoneId}/details`);
    }
    req.stone = stone
    next();
};

module.exports = router;