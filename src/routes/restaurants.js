const { Router } = require("express");
const router = Router();
const sessionView = require("../utils/sessionView");
const verifySession = require("../middleware/verifySession");

const restaurantController = require("../controllers/restaurant.controller");

// index login
router.get('/', verifySession(), async (req, res) => {
    res.send("hola->list");
    res.redirect('/list');
});


// list
router.get('/list', verifySession(), async (req, res) => {
    sessionView.renderView(req, res, "restaurant/", "Restaurants", req.session);
});


// list restaurants
router.get('/getCurrent', verifySession(), async (req, res) => {
    const filters = { usertype: req.session.user.extraInfo.userType };
    const restaurants = await restaurantController.getAllRestaurants(req.session.token, filters);
    return res.status(200).json(restaurants);
});


// details restaurant
router.get('/details/:id', verifySession(), async (req, res) => {
    const preId = req.params.id;

    if(!preId) return res.status(401).json({
        success: false,
        message: `incomplete fields, id undefined`
    });

    const user = req.session.user;
    const Id = preId.toString().split("").reverse().join("");

    // get restaurant
    const restaurant = await restaurantController.getAllRestaurants(req.session.token, {id: Id, allstates: true});

    // get menus
    const menus = await restaurantController.getMenus(req.session.token, { IdRestaurant: Id });

    const data = { menus: menus.rows, restaurant: restaurant.rows, user };

    sessionView.renderView(req, res, "restaurant/details", "Clients", data);
});


// add restaurant
router.post('/add', verifySession(), async (req, res) => {
    if(!req.body.uid) return res.status(202).json({
        success: false,
        message: `incomplete fields`
    });

    req.body.idClient = req.body.uid;
    req.body.paymentMethod = req.body.paymentMethod.join("");
    req.body.serviceOptions = req.body.serviceOptions.join("");
    delete req.body.uid;

    const data = await restaurantController.addRestaurant(req.session.token, { restaurant: req.body });
    return res.status(200).json({success: data.success, message: data.message});
});


// add menu
router.post('/addMenu', verifySession(), async (req, res) => {
    if(!req.body.idRestaurant) return res.status(202).json({
        success: false,
        message: `incomplete fields`
    });

    const data = await restaurantController.addMenu(req.session.token, { menu: req.body });
    return res.status(200).json({success: data.success, message: data.message});
});


// edit menu
router.put('/editMenu', verifySession(), async (req, res) => {
    if(!req.body.name) return res.status(202).json({
        success: false,
        message: 'indicate name'
    });

    if(!req.body.price) return res.status(202).json({
        success: false,
        message: 'indicate price'
    });

    const data = await restaurantController.updMenu(req.session.token, { menu: req.body });
    return res.status(200).json({success: data.success, message: data.message});
});


// list tags
router.get('/tags', verifySession(), async (req, res) => {
    const tags = await restaurantController.getTags(req.session.token, {});
    return res.status(200).json(tags);
});


// list content menu
router.get('/menuContent', verifySession(), async (req, res) => {
    const { idMenu } = req.query || req.body;
    const contents = await restaurantController.getMenuContent(req.session.token, {IdMenu: idMenu});
    return res.status(200).json(contents);
});


// add menu content
router.post('/addContent', verifySession(), async (req, res) => {
    if(!req.body.idMenu) return res.status(202).json({
        success: false,
        message: `incomplete fields`
    });

    const data = await restaurantController.addContent(req.session.token, { menu: req.body });
    return res.status(200).json({success: data.success, message: data.message});
});


// delete content
router.delete('/content', verifySession(), async (req, res) => {
    const { id } = req.body;
    if(!id) return res.status(202).json({
        success: false,
        message: `incomplete fields`
    });

    const data = await restaurantController.delMenuContent(req.session.token, {id});
    return res.status(200).json({success: data.success, message: data.message});
});


// open now
router.put('/open', verifySession(), async (req, res) => {
    const open = req.body;
    if(!open) return res.status(202).json({
        success: false,
        message: `incomplete fields`
    });

    const data = await restaurantController.openNowExec(req.session.token, open);
    return res.status(200).json({success: data.success, message: data.message});
});


// show menu
router.put('/showmenu', verifySession(), async (req, res) => {
    const show = req.body;
    if(!show) return res.status(202).json({
        success: false,
        message: `incomplete fields`
    });
    const data = await restaurantController.showMenu(req.session.token, show);
    return res.status(200).json({success: data.success, message: data.message});
});


module.exports = router;