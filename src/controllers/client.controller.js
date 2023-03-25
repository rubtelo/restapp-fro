const methods = require("../utils/methods");

// get clients
exports.getAllClients = async (token, filters = {}) => {
   try {
        const clients = await methods.sendGet(token, filters, "/api/clients/");

        if(clients.success === true){
            for (let item of clients.data) {
                item.IsActive = item.IsActive == 1 ? '<i class="fa-regular fa-circle-check text-success"></i>' : '<i class="fa-regular fa-circle-xmark text-danger">';
                item.code = item.IdUser.toString().split("").reverse().join("");
            }
        }

        return {
            success: clients.success, 
            total: clients.data.length,
            totalNotFiltered: 0,
            rows: clients.data
        };

   } catch (error) {
      console.log("error get clients.");
   }
};


// get clients
exports.addClient = async (token, client = {}) => {
    try {
        return await methods.sendPost(token, client, "/api/clients/create");

    } catch (error) {
        console.log("error add clients.");
    }
};
