const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Spot, SpotImage, Review, User} = require("../../db/models")

const router = express.Router();

const validateSpotCreate = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address already exist.'),
  check('address')
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .notEmpty()
    .isDecimal(
      {min: -90,
      max: 90})
    .withMessage('Latitude is not valid'),
  check('lng')
    .notEmpty()
    .isDecimal(
    {min: -180,
    max: 180})
    .withMessage('Longitude is not valid'),
  check('name')
    .notEmpty()
    .isLength({ max: 49 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .notEmpty()
    .withMessage('Price per day is required'),
  handleValidationErrors
];

async function avgRating() {
const allSpots = await Spot.findAll({});
allSpots.forEach(async (spot) => {
const prevImg = await SpotImage.findOne({
    where: {spotId: spot.id},
    raw: true
  })
  await Spot.update(
    {previewImg: prevImg.url},
    {where: {id: spot.id}}
  )
    let total = 0;
    let count = 0
    const review = await Review.findAll({
        where: {spotId: spot.id},
        raw: true
    })
    review.forEach(async (rev) => {
        total += rev.stars;
        count ++
    })
    spot.avgRating = total/count
    await Spot.update(
        {avgRating: spot.avgRating},
        {where: {id: spot.id}}
    )
})
return 
}

//GET All Spots
  router.get('/',
  async (req, res) => {
    const allSpots = await Spot.findAll({
      attributes: {
        include: ["avgRating", "previewImg"]
      }
    });
    res.json(allSpots)
  });

  //GET Current User Spots

  router.get(
    '/current',
    async (req, res) => {
      const { user } = req;
      if (user) {
        const currentUser = await Spot.findByPk(user.id,{
          attributes: {
            include: ["avgRating", "previewImg"]
          }
        })
        
        return res.json({"Spots": [currentUser]});
      } else return res.json(401, {
        message: "Authentication required"
    });
    }
  );

//Create a Spot

router.post(
  '',
  validateSpotCreate,
  async(req, res) => {
    const { user } = req;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    if(user){

      const spot = await Spot.create({ 
        ownerId: user.id, 
        address: address, 
        city: city, 
        state: state, 
        country: country, 
        lat: lat, 
        lng: lng, 
        name: name, 
        description: description, 
        price: price
      })

return res.json(spot)
  }else return res.json(401, {
    message: "Authentication required"
})
  }
);

//Get Details of a Spot from an id

router.get(
  ("/:spotid"),
  async (req, res) => {
    const spotId = +req.params.spotid;
    const currentSpot = await Spot.findByPk(spotId, {
      attributes: {
        include: ["avgRating", "previewImg"]
      }
    })
    const spotimg = await SpotImage.findAll({
      where: {spotId: currentSpot.id}
    })
    const {id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt, avgRating} = currentSpot
    const spotOwner = await User.findByPk(currentSpot.ownerId, {
      attributes: {
        exclude: ["username"]
      }
    })
    const reviews = await Review.findAll({
      where: {spotId: currentSpot.id}
    })
    let count = 0;
    for (let properties in reviews) {
      count ++
    }
    const final = {
      id, 
      ownerId, 
      address, 
      city, 
      state, 
      country, 
      lat, 
      lng, 
      name, 
      description, 
      price, 
      createdAt, 
      updatedAt,
      numReviews: count,
      avgStarRating: avgRating,
      SpotImages: spotimg,
      Owner: spotOwner
    }
    res.json(final)
  }
)

module.exports = router;