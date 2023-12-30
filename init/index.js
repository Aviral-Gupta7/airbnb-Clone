const mapToken =
  "pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js");
const data = require("./data.js");
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "657a6508a86f8ce7edded286",
  }));
  for (singleData of initData.data) {
    let response = await geocodingClient
      .forwardGeocode({
        query: singleData.location + " " + singleData.country,
        limit: 1,
      })
      .send();
    singleData.geometry = response.body.features[0].geometry;
  }
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
