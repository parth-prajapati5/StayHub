
// const listingschema=new mongoose.Schema({
//      title:{
//         type:String,
//         required:true
//      },
//      ImageUrl:{
//         type:String,
//         default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx_-0nkLwAlK7Jx1zPk5cPgFvEhPsU0LfHMQ&s",
//         set:(url)=>url === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx_-0nkLwAlK7Jx1zPk5cPgFvEhPsU0LfHMQ&s":url
//      },
//      description:String,
//      price:Number,
//      location:String,
//      country:String
// });
// const Listing=mongoose.model('Listing',listingschema);
// module.exports=Listing;
const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true
  },
  image: {
    filename: {
      type: String
    },
    url: {
      type: String,
    },
  },

  price: {
    type: Number,
    required: true,
  },
  location: String,
  country: String,
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  owner: {
  type: Schema.Types.ObjectId,
  ref: 'User'
},
  reviews: [
  {
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }
]
});

listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
})


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
