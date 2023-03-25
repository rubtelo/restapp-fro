const methods = require("../utils/methods");

// get restaurants
exports.getAllRestaurants = async (token, filters = {}) => {
   try {
        const restaurants = await methods.sendGet(token, filters, "/api/restaurants/");

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
        const menus = await methods.sendGetData(token, filters, "/api/menus/listmenu/");

        if(menus.success === true){
            for (let item of menus.data) {
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
        return await methods.sendGetData(token, filters, "/api/menus/menudetails/");

    } catch (error) {
        console.log("error get menu content.");
    }
};


// add content
exports.addContent = async (token, menu = {}) => {
    try {
        return await methods.sendPost(token, menu, "/api/menus/content/");

    } catch (error) {
        console.log("error add menu.content");
    }
};


// delete content menu
exports.delMenuContent = async (token, id = {}) => {
    try {
        return await methods.sendDelete(token, id, "/api/menus/content/");

    } catch (error) {
        console.log("error del menu content.");
    }
};


// add restaurant
exports.addRestaurant = async (token, restaurant = {}) => {
    try {
        return await methods.sendPost(token, restaurant, "/api/restaurants/create/");

    } catch (error) {
        console.log("error add restaurant.");
    }
};


// add menu
exports.addMenu = async (token, menu = {}) => {
    try {
        return await methods.sendPost(token, menu, "/api/menus/create/");

    } catch (error) {
        console.log("error add menu.");
    }
};


// edit menu
exports.updMenu = async (token, menu = {}) => {
    try {
        return await methods.sendPut(token, menu, "/api/menus/edit");
    } catch (error) {
        console.log("error add menu.");
    }
};


// get tags menus
exports.getTags = async (token, filters) => {
    try {
        return await methods.sendGet(token, filters, "/api/menus/tags/");

    } catch (error) {
        console.log("error get tags.");
    }
};


// put open now
exports.openNowExec = async (token, data) => {
    try {
        return await methods.sendPut(token, data, `/api/restaurants/isopen/${data.id}`);
    } catch (error) {
        console.log("error get tags.");
    }
};


// put show menu
exports.showMenu = async (token, data) => {
    try {
        return await methods.sendPut(token, data, `/api/menus/isactive/${data.id}`);
    } catch (error) {
        console.log("error get tags.");
    }
};
