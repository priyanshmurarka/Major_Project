const Listing = require("./Models/listing");
const Review = require ("./Models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
 if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must login to perform any task.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
     let {id}= req.params;
     let listing = await Listing.findById(id);
     if(! (res.locals.currUser && listing.owner.equals(res.locals.currUser._id))){
        req.flash("error","You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
     }
     next();
};

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else
    next();
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else
    next();
};

module.exports.isAuthor = async(req,res,next) => {
     let { id,reviewId }= req.params;
     let review = await Review.findById(reviewId);
     if(! (res.locals.currUser && review.author.equals(res.locals.currUser._id))){
        req.flash("error","You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
     }
     next();
};

