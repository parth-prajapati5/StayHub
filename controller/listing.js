const Listing = require('../models/listing.js');


module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("./listings/index.ejs", { alllistings })
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.specificListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'reviews', populate: {
            path: 'author'
        }
    }).populate('owner');
    if (!listing) {
        req.flash('error', 'Cannot find that listing');
        res.redirect('/listings');
    }
    // console.log(res.locals.currUser);
    res.render("./listings/show.ejs", { listing });
}

module.exports.Newpost = async (req, res, next) => {
    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}&limit=1`,
            {
                headers: {
                    "User-Agent": "MajorProjectApp_PP543/1.0 (contact: test@example.com)"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.statusText}`);
        }

        const textResponse = await response.text();
        let data1;
        try {
            data1 = JSON.parse(textResponse);
        } catch (e) {
            console.error("Nominatim API returned non-JSON:", textResponse);
            throw new Error("Geocoding API returned invalid JSON. Access might be denied.");
        }

        if (!data1 || data1.length === 0) {
            req.flash("error", "Location not found");
            return res.redirect("/listings/new");
        }

        const lat = parseFloat(data1[0].lat);
        const lon = parseFloat(data1[0].lon);

        console.log("Latitude:", lat);
        console.log("Longitude:", lon);

        console.log(req.file);
        const url = req.file.path;
        const filename = req.file.filename;
        const data = req.body.listing;
        const newlisting = new Listing(data);
        newlisting.geometry = {
            type: 'Point',
            coordinates: [lon, lat]
        }
        newlisting.owner = req.user._id;
        newlisting.image = { filename, url };
        await newlisting.save();
        req.flash('success', 'Successfully created a new listing');
        res.redirect("/listings");

    } catch (err) {
        next(err)
    }
};

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing');
        res.redirect('/listings');
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the listing');

    res.redirect("/listings");
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    try { 

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}&limit=1`,
            {
                headers: {
                    "User-Agent": "MajorProjectApp_PP543/1.0 (contact: test@example.com)"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.statusText}`);
        }

        const textResponse = await response.text();
        let data1;
        try {
            data1 = JSON.parse(textResponse);
        } catch (e) {
            console.error("Nominatim API returned non-JSON:", textResponse);
            throw new Error("Geocoding API returned invalid JSON. Access might be denied.");
        }

        if (!data1 || data1.length === 0) {
            req.flash("error", "Location not found");
            return res.redirect("/listings/new");
        }

        const lat = parseFloat(data1[0].lat);
        const lon = parseFloat(data1[0].lon);

        console.log("Latitude:", lat);
        console.log("Longitude:", lon);

        listing.geometry = {
            type: "Point",
            coordinates: [lon, lat]
        };

    if (typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { filename, url };
    }
    req.flash('success', 'Successfully edited the listing');
    res.redirect("/listings");
    await listing.save();

}catch (err) {
        req.flash("error", "Error fetching geocoding data");
        return res.redirect("/listings");
    }
    
};