const express=require('express');
const router=express.Router({mergeParams:true});
const Review=require('../models/review.js');
const Listing=require('../models/listing.js');
const WrapAsync=require('../utils/WrapAsync.js');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js');
const reviewController=require('../controller/reviews.js');
const review = require('../models/review.js');


//reviews
//post review route
router.post("/",isLoggedIn,validateReview,WrapAsync(reviewController.createReview));

//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,WrapAsync(reviewController.destroyReview));


module.exports=router;