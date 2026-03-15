const mongoose=require('mongoose');
const intidata=require('./data.js');
const Listing=require('../models/listing.js');


const mongo_url='mongodb://127.0.0.1:27017/wanderlust';
async function main() {
  await mongoose.connect(mongo_url);

}

main().then(()=>{
    console.log("connected to mongo");
}).catch((err)=>{
    console.log("error connecting to mongo",err);
});


const initdb=async ()=>{
    await Listing.deleteMany({});
     intidata.data=intidata.data.map((obj)=>({...obj,owner: "696d1bfb1533cd239e64ae7a"}))
    await Listing.insertMany(intidata.data)
    console.log("database initialized");
}

initdb();