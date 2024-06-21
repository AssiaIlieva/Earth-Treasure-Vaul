const router = require('express').Router();
const {isAuth} = require('../middlewares/authMiddlware');
const stoneService = require('../services/stoneService');

router.get('/', async (req, res) => {
    const latestStones = await stoneService.getLatest().lean();
    res.render('home', {latestStones})
});

// TODO: Delete this
router.get('/authorize-test', isAuth, (req, res) => {
    console.log(req.user);
    res.send('Your are authorized');
})

module.exports = router