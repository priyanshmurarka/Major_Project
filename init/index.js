const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

const Mongo_Url="mongodb://127.0.0.1:27017/Tripzone";
main().then( () => {
    console.log("Connected to database.");
}).catch( (err) => {
    console.log(err); 
})
async function main() {
    await mongoose.connect(Mongo_Url);
}

const initDB = async () => {
     await Listing.deleteMany({});
     initData.data = initData.data.map((obj)=> ({...obj , owner:"68380a093d85f8179b0d6382"}));
     await Listing.insertMany(initData.data);
     console.log("Data was initialized.");
}

initDB();