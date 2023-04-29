const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Spot, SpotImage, Review, User, ReviewImage} = require("../../db/models")

const router = express.Router();

const validateSpotCreate = [
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
    .isFloat(
      {min: -90,
      max: 90})
    .withMessage('Latitude is not valid'),
  check('lng')
    .notEmpty()
    .isFloat(
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

const validateSpotEdit = [
  check('lat')
    .isFloat(
      {min: -90,
      max: 90})
    .withMessage('Latitude is not valid'),
  check('lng')
    .isFloat(
    {min: -180,
    max: 180})
    .withMessage('Longitude is not valid'),
  check('name')
    .isLength({ max: 49 })
    .withMessage('Name must be less than 50 characters'),
  handleValidationErrors
];

const validateReviews = [
  check('review')
    .notEmpty()
    .withMessage('Review text is required'),
    check('stars')
    .notEmpty()
    .isInt({min: 1,
      max: 5})
    .toInt()
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

async function update(allSpots) {
  for (const spot of allSpots) {
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
    
    const prevImg = await SpotImage.findOne({
      where: {spotId: spot.id,
        preview: true},
      raw: true
    });
    if(total/count){
    spot.avgRating = total/count}
    if(prevImg){
    spot.previewImg = prevImg.url}
    else{spot.previewImg = "N/A"}

    await spot.save()
}
}

//GET All Spots
  router.get('/',
  async (req, res) => {
    const allSpots = await Spot.findAll({
      attributes: {
        include: ["avgRating", "previewImg"]
      }
    });
    await update(allSpots)
    return res.json(allSpots)
  });

  //GET Current User Spots
  router.get(
    '/current',
    async (req, res) => {
      const { user } = req;
      if(!user){
        return res.status(401).json({ "message": "Authentication required"})}
    const currentUser = await Spot.findAll({where: {ownerId: user.id}},{
      attributes: {
        include: ["avgRating", "previewImg"]
      }
    })
    await update(currentUser)

    return res.json(currentUser)
  });

//Create a Spot
router.post(
  '',
  validateSpotCreate,
  async(req, res) => {
    const { user } = req;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    if(!user){return res.status(401).json({ "message": "Authentication required"})}

      const spot = await Spot.create({ 
        ownerId: user.id, 
        address, 
        city, 
        state, 
        country, 
        lat, 
        lng, 
        name, 
        description, 
        price
      })

     await spot.save()

     const newSpot = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price
     }


return res.json(newSpot)
    });

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
    if (!currentSpot){
      res.json({
        "message": "Spot couldn't be found"
      })
    };
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

//Add an Image to a Spot by Id
router.post(
  ("/:spotid/images"),
  async (req, res) => {
    const { user } = req;
    const id = req.params.spotid;
    const {url, preview} = req.body    
    const spot = await Spot.findByPk(id)
    const spotImages = await SpotImage.findAll({where: {spotId: id}})
    if(!user){return res.status(401).json({ "message": "Authentication required"})}
    if(!spot){
      return res.json({
        "message": "Spot couldn't be found"
      })
    }
    if (user.id !== spot.ownerId) {
      return res.json({"message": "Authentication required"})
    }
    // console.log(spotImages)
    if(preview){
      spotImages.forEach((si) => {
        si.preview = false
        si.save()
      })
    }
    const newSpot = await SpotImage.create({
      spotId: id,
      url,
      preview
    })
    return res.json({
      id,
      url,
      preview
    })
  }
)

//Edit a Spot
router.put(
  ("/:spotid/"),
  validateSpotEdit,
  async (req, res) => {
    const { user } = req;
    const id = req.params.spotid;
    const {address, city, state, country, lat, lng, name, description,price} = req.body
    const spot = await Spot.findByPk(id)
    if(!spot){
      return res.status(404).status({
        "message": "Spot couldn't be found"
      })
    }
    if (!user || user.id !== spot.ownerId) {return res.status(401).json({ "message": "Authentication required"})}    
  

    if (address) {spot.address = address};
    if (city) {spot.city = city};
    if (state) {spot.state = state}
    if (country) {spot.country = country}
    if (lat) {spot.lat = lat}
    if (lng) {spot.lng = lng}
    if (name) {spot.name = name}
    if (description) {spot.description = description}
    if (price) {spot.price = price}

    await spot.save()

    return res.json(
      spot
    )
  }
)
//Delete a Spot
router.delete('/:spotid', async(req, res) => {
  const {user} = req;
  const id = req.params.spotid;
  const spot = await Spot.findOne({where: {id: id}})
  if(!spot){
    return res.status(404).json({
      "message": "Spot couldn't be found"
    })
  }
  if (!user || user.id !== spot.ownerId) {
    return res.json(401, {"message": "Authentication required"})
  }
  await spot.destroy()
  return res.json({
    "message": "Successfully deleted"
  })
}
)

//Get all Reviews by a Spot's id
router.get('/:spotid/reviews', async(req, res) => {
  const id = req.params.spotid;
  const spot = await Spot.findByPk(id);
  if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
  const Reviews = await Review.findAll({
    where: {
      spotId: id
  },
  include: [
      {model: User,
      attributes: ["id", "firstName", "lastname"]},
      {model: ReviewImage, 
      attributes: ["id", "url"]}
  ]
  })
return res.json({Reviews})
})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotid/reviews', validateReviews, async(req, res, next) => {
  const {user} = req;
  if(!user){
    return res.status(401).json({ "message": "Authentication required"})}
  const id = req.params.spotid;
  const {review, stars} = req.body;

  const newReview = await Review.create(
    {userId: user.id,
    spotId: id,
    review,
    stars
  })

  await newReview.save()

  return res.json(newReview)
})


module.exports = router;

