const { Router } = require("express");
const router = Router();
const sessionView = require("../utils/sessionView");
const verifySession = require("../middleware/verifySession");

const generalController = require("../controllers/general.controller");

// index login
router.get('/', async (req, res) => {
    if (!req.session.user) {
        delete req.session.user;
        delete req.session.token;
        return res.render('login', {
            title: 'Login'
        });
    }

    res.redirect('/panel');
});


// login signin
router.post('/signin', async (req, res) => {
    const user = await generalController.getUser(req.body);

    if(user.success == true){
        req.session.user = user.my;
        req.session.token = user.token;
        res.redirect('/panel');

    } else {
        delete req.session.user;
        delete req.session.token;
        res.json(user);
        res.redirect('/');
    }
});


// panel
router.get('/panel', verifySession(), async (req, res) => {
    sessionView.renderView(req, res, "panel/", "Panel", req.session);
});


// regions
router.get('/regions', verifySession(), async (req, res) => {
    res.status(200).json([
        {
            "IdRegion": 11001,
            "Country": "Colombia",
            "State": "Bogotá",
            "City": "BOGOTÁ, D.C."
        },
        {
            "IdRegion": 25175,
            "Country": "Colombia",
            "State": "Cundinamarca",
            "City": "CHÍA"
        },
        {
            "IdRegion": 25754,
            "Country": "Colombia",
            "State": "Cundinamarca",
            "City": "SOACHA"
        }
    ]);
});


// paymethods
router.get('/paymethods', verifySession(), async (req, res) => {
    const data = { results:[ 
        {id: 1, text: "efectivo"}, {id: 2, text: "tc"}, {id: 3, text: "td"},
        {id: 4, text: "daviplata"}, {id: 5, text: "nequi"}, {id: 6, text: "otros"}
    ]};
    res.status(200).json(data);
});


// serviceOptions
router.get('/serviceopt', verifySession(), async (req, res) => {
    const data = { results:[ 
        {id: 1, text: "comer en sitio", "selected": true},
        {id: 2, text: "para llevar"},
        {id: 3, text: "domicilio"}
    ]};
    res.status(200).json(data);
});


// categories menu
router.get('/categories', async (req, res) => {
    const data = { results:[ 
        {id: 1, text: "Desayuno"},
        {id: 2, text: "Almuerzo"},
        {id: 3, text: "Cena"}
    ]};
    res.status(200).json(data);
});


// logout
router.get('/logout',(req, res) => {
    delete req.session.user;
    res.redirect("/");
});


module.exports = router;
