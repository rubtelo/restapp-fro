require('dotenv').config();
const moment = require("moment-timezone");
const axios = require('axios').default;

const host = process.env.URL_BACK;
const protocol =  'http://';


// get clients
exports.getAllClients = async (token, filters = {}) => {
   try {
        const clients = await sendGet(token, filters, "/api/clients/");

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
        return await sendPost(token, client, "/api/clients/create");

    } catch (error) {
        console.log("error add clients.");
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
            params: filters
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
