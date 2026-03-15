const express=require('express');
const router=express.Router();
const WrapAsync=require('../utils/WrapAsync.js');

const Listing=require('../models/listing.js');

const {isLoggedIn,isOwner,validateListing}=require('../middleware.js');

const ListingController=require('../controller/listing.js');
const multer  = require('multer')

const {storage}=require('../cloudConfig.js');
const upload = multer({ storage});

router.use('/listings',(req,res,next)=>{  //middleware for Listings route 
    console.log("before the listings route");
    next();
})

// router.get('/',(req,res)=>{
//     res.send("hello");
// })


//index route to show all listings
// router.get('/', WrapAsync(ListingController.index))

router.route('/')
.get( WrapAsync(ListingController.index))
.post(isLoggedIn,validateListing,upload.single('image'),WrapAsync((ListingController.Newpost)));


//create new listing form route

router.get("/new",isLoggedIn,ListingController.renderNewForm);


// router.post("/",validateListing,WrapAsync(async(req,res,next)=>{
//  const data=req.body.listing;
// const newlisting= new Listing(data);
// newlisting.owner=req.user._id;

// let result=listingschema.validate(req.body);
// if(result.error){
//     throw new ExpressError(400,result.error);
// }
// if(!newlisting.title){
//     throw new ExpressError(400,"title is missing");
// }
// if(!newlisting.description){
//     throw new ExpressError(400,"Descripion is missing");
// }
// if(!newlisting.location){
//     throw new ExpressError(400,"Location is missing");
// // }
// await newlisting.save();
// req.flash('success','Successfully created a new listing');
// res.redirect("/listings");
// }))

//specific listing route
router.route('/:id')
.get(WrapAsync(ListingController.specificListing))
.put( isLoggedIn,isOwner,validateListing,upload.single('image'),WrapAsync(ListingController.updateListing))
.delete( isLoggedIn,isOwner,WrapAsync(ListingController.deleteListing));
// router.get('/:id',WrapAsync(ListingController.specificListing));

router.get("/:id/edit", isLoggedIn,isOwner, WrapAsync(ListingController.editRoute));


// router.put("/:id", isLoggedIn,isOwner,validateListing,WrapAsync(ListingController.updateListing));



//delete route

// router.delete("/:id", isLoggedIn,isOwner,WrapAsync(ListingController.deleteListing));



module.exports=router;