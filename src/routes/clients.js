const { Router } = require("express");
const router = Router();
const sessionView = require("../utils/sessionView");
const verifySession = require("../middleware/verifySession");

const clientController = require("../controllers/client.controller");
const restaurantController = require("../controllers/restaurant.controller");


// index login
router.get('/', verifySession(), async (req, res) => {
    res.send("hola->list");
    res.redirect('/list');
});


// list
router.get('/list', verifySession(), async (req, res) => {
    sessionView.renderView(req, res, "client/", "Clients", req.session);
});


// list clients
router.get('/getClients', async (req, res) => {
    const filters = { usertype: req.session.user.extraInfo.userType };
    const clients = await clientController.getAllClients(req.session.token, filters);
    return res.status(200).json(clients);
});


// details client
router.get('/details/:id', verifySession(), async (req, res) => {
    const preId = req.params.id;

    if(!preId) return res.status(401).json({
        success: false,
        message: `incomplete fields, id undefined`
    });

    const user = req.session.user;
    const Id = preId.toString().split("").reverse().join("");

    // info client
    const client = await clientController.getAllClients(req.session.token, {id: Id});

    // get restaurants
    const restaurants = await restaurantController.getAllRestaurants(req.session.token, {idUser: Id, allstates: true});

    const data = { client:client.rows, restaurants: restaurants.rows, user };
    sessionView.renderView(req, res, "client/details", "Clients", data);
});


// add client
router.post('/add', verifySession(), async (req, res) => {
    if(!req.body.uid) return res.status(202).json({
        success: false,
        message: `incomplete fields`
    });

    req.body.idUser = req.body.uid;
    delete req.body.uid;

    const data = await clientController.addClient(req.session.token, { client: req.body });
    return res.status(200).json({success: data.success, message: data.message});
});


module.exports = router;
