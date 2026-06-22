if(process.env.NODE_ENV     != 'production'){

    require('dotenv').config()
}

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('./Schema.js');
const cookieParser=require('cookie-parser');
const listing=require('./routes/listing.js');
const reviews=require('./routes/review.js');
const session=require('express-session');
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const flash=require('connect-flash');
const passport=require('passport');
const Localstrategy=require('passport-local');
const User=require('./models/user.js');
const  signupRoute=require('./routes/signup.js');

const dburl=process.env.ATLASDB_URL;

app.engine('ejs',ejsMate);


const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
       secret:process.env.SECRET,
    },
    touchAfter:24 * 3600
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(methodOverride('_method'));
app.use(cookieParser('secretCode'));
app.use(flash());
app.use(session(sessionOptions));

//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));



async function main() {
  await mongoose.connect(dburl);

}

main().then(()=>{
    console.log("connected to mongo");
}).catch((err)=>{
    console.log("error connecting to mongo",err);
});

const validateListing=(req,res,next)=>{
       let {error}=listingSchema.validate(req.body);
       if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
       }else{
        next();
       }
}

const validateSchema=(req,res,next)=>{
       let {error}=reviewSchema.validate(req.body);
       if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
       }else{
        next();
       }
}

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    res.locals.requestedUrl=req.session.requestedUrl;
    next();
})

app.get('/',(req,res)=>{
    res.redirect('/listings');
})
app.use('/listings',listing);
app.use('/listings/:id/review',reviews);
app.use('/',signupRoute);

// app.use('/',(req,res,next)=>{  //middleware for root route
//     console.log("before the root");
//     next();
// })

// app.get('/demo',async (req,res)=>{
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"student"
//     })

//     let user=await User.register(fakeuser,'password123');
//     res.send(user);
// })

app.get('/getcookie',(req,res)=>{
    // res.cookie('color','red',{signed:true});
    // res.clearCookie();
    res.send("sent cookie by server");
})

app.get('/verify',(req,res)=>{
    res.send(req.signedCookies);
})

// app.get('/verify',(req,res)=>{
//        res.send(req.signedCookies);
// })

// app.get('/testlisting',async (req,res)=>{
//     const newlisting=new Listing({
//        title:"Beautiful Beach House",
//        description:"A lovely beach house with stunning views.",
//        price:250,
//        location:"Malibu",
//        country:"USA"
//     })
//     await newlisting.save().then((result)=>{
//         console.log("listing saved",result);
//         res.send("listing saved")
//     })
// })

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

// app.use((err,req,res,next)=>{
//     // res.send("something went wrong!");
//     let {statuscode=500,message="something went wrong"}=err;
//     res.status(statuscode).send(message);
// })

// app.use((err, req, res, next) => {
//   const { statuscode = 500, message = "Something went wrong" } = err;
//   res.status(statuscode).send(message);
//   req.flash('error', message);
// });

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something went wrong" } = err;

  if (statuscode === 404) {
    return res.status(404).render("./listings/404page", { message });
  }

  res.status(statuscode).send(message);
});


app.listen(3000,()=>{
    console.log("server started at 3000");
})