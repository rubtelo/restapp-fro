require('dotenv').config();
const moment = require("moment-timezone");
const axios = require('axios').default;

const host = process.env.URL_BACK;
const protocol =  'http://';


// get restaurants
exports.getAllRestaurants = async (token, filters = {}) => {
   try {
        const restaurants = await sendGet(token, filters, "/api/restaurants/");

        if(restaurants.success === true){
            for (let item of restaurants.data) {
                item.IsActive = item.IsActive == 1 ? '<i class="fa-regular fa-circle-check text-success"></i>' : '<i class="fa-regular fa-circle-xmark text-danger">';
                item.code = item.IdRestaurant.toString().split("").reverse().join("");
            }
        }

        return {
            success: restaurants.success, 
            total: restaurants.data.length,
            totalNotFiltered: 0,
            rows: restaurants.data
        };

   } catch (error) {
      console.log("error get restaurants.");
   }
};


// get restaurants menus
exports.getMenus = async (token, filters) => {
    try {
        const menus = await sendGet(token, filters, "/api/menus/listmenu/");

        if(menus.success === true){
            for (let item of menus.data) {
                item.IsActive = item.IsActive == 1 ? '<i class="fa-regular fa-circle-check text-success"></i>' : '<i class="fa-regular fa-circle-xmark text-danger">';
                item.code = item.IdMenu.toString().split("").reverse().join("");
            }
        }

        return {
            success: menus.success, 
            total: menus.data.length,
            totalNotFiltered: 0,
            rows: menus.data
        };

    } catch (error) {
        console.log("error get menus.");
    }
};


// get content menus
exports.getMenuContent = async (token, filters) => {
    try {
        return await sendGet(token, filters, "/api/menus/menudetails/");

    } catch (error) {
        console.log("error get menu content.");
    }
};


// add content
exports.addContent = async (token, menu = {}) => {
    try {
        return await sendPost(token, menu, "/api/menus/content/");

    } catch (error) {
        console.log("error add menu.content");
    }
};


// delete content menu
exports.delMenuContent = async (token, id = {}) => {
    try {
        return await sendDelete(token, id, "/api/menus/content/");

    } catch (error) {
        console.log("error del menu content.");
    }
};


// add restaurant
exports.addRestaurant = async (token, restaurant = {}) => {
    try {
        return await sendPost(token, restaurant, "/api/restaurants/create/");

    } catch (error) {
        console.log("error add restaurant.");
    }
};


// add menu
exports.addMenu = async (token, menu = {}) => {
    try {
        return await sendPost(token, menu, "/api/menus/create/");

    } catch (error) {
        console.log("error add menu.");
    }
};


// get tags menus
exports.getTags = async (token, filters) => {
    try {
        return await sendGet(token, filters, "/api/menus/tags/");

    } catch (error) {
        console.log("error get tags.");
    }
};


// consumir endpoint post
async function sendPost(token, mydata, myurl) {
    const url = protocol + host + myurl;

    try {
        const respuesta = await axios.post(url, mydata, {
            headers: {
                'token': token,
                'Content-Type': 'application/json',
                'type': 'authenticated'
            }
        });
        return respuesta.data;

    } catch (error) {
        if (error.response.status >= 400) {
            return error.response.data;
        } else {
            console.log(error);
        }
    }
};


// consumir endpoint get
async function sendGet(token, filters, myurl) {
    const url = protocol + host + myurl;
    try {
        const respuesta = await axios.get(url, {
            headers: {
                'token': token,
                'Content-Type': 'application/json',
                'type': 'authenticated'
            },
            data: filters
        });
        return respuesta.data;

    } catch (error) {
        if (error.response.status >= 400) {
            return error.response.data;
        } else {
            console.log(error);
        }
    }
};


// consumir endpoint delete
async function sendDelete(token, id, myurl) {
    const url = protocol + host + myurl;
    try {
        const respuesta = await axios.delete(url, {
            headers: {
                'token': token,
                'Content-Type': 'application/json',
                'type': 'authenticated'
            },
            data: id
        });
        return respuesta.data;

    } catch (error) {
        if (error.response.status >= 400) {
            return error.response.data;
        } else {
            console.log(error);
        }
    }
};
