const router = require('express').Router();
const {isAuth} = require('../middlewares/authMiddlware');
const stoneService = require('../services/stoneService');

router.get('/', async (req, res) => {
    const latestStones = await stoneService.getLatest().lean();
    res.render('home', {latestStones})
});

router.get('/search', async (req, res) => {
    const {name} = req.query;
    
    let stones = []
    if(name){
        stones = await stoneService.search(name).lean();
    }else{
        stones = await stoneService.getAll().lean();
    }
    res.render('search',{stones, name})
})


module.exports = router