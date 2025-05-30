const Listing = require("../Models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.new = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.create = async (req, res) => {
  let coordinate = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
}).send();

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = {
      filename: req.body.listing.image.filename,
      url: req.file.path,                              
    };
  };
  newListing.geometry = coordinate.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Listing was created.");
  res.redirect("/listings");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist.");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist.");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("./listings/edit.ejs", { listing, originalImageUrl});
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    listing.image = {
      filename: req.body.listing.image.filename,
      url: req.file.path,                              
    };
     await listing.save();
  };
  req.flash("success", "Listing was updated.");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing was deleted.");
  res.redirect("/listings");
};
