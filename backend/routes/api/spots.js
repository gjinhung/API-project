const express = require('express');
const { Op } = require('sequelize');
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Spot, SpotImage, Review, User, ReviewImage, Sequelize} = require("../../db/models")

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
    .custom((value, { req }) => {
    if(value > 90 || value < -90){
        throw new Error ('Latitude is not valid')
    }
return true}),
  check('lng')
  .custom((value, { req }) => {
    if(value > 180 || value < -180){
        throw new Error ('Latitude is not valid')
    }
return true}),
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
const validateImg = [
  check('preview')
  .isBoolean()
  .withMessage('Is this a Preview Image?')
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
    if(Object.keys(req.query).length === 0){
    const allSpots = await Spot.findAll({
      attributes: {
        include: ["avgRating", "previewImg"]
      }
    });
    await update(allSpots)
    return res.json(allSpots)
  }
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
  page = parseInt(page)
  size = parseInt(size)


  if (!page) {page = 1}
  if (!size) {size = 20}
  if (page > 10) {page = 10}
  if (size > 20) {page = 20}

  let errors = {}
  let list = []
  
  if(minLat) {
    if(isNaN(parseInt(+minLat)) || (minLat < -90 || minLat > 90)){
      errors.minLat = "Minimum latitude is invalid"
    }
      const lats = await Spot.findAll({
        where: {lat: {[Op.gte]: minLat}}})
        for (const lat of lats ){
         list.push(lat.id)
        }
        console.log(list)
      }

  if(maxLat) {
    if(isNaN(parseInt(+maxLat)) || (maxLat < -90 || maxLat > 90)){
      errors.maxLat = "Maximum latitude is invalid"
    }
      const lats = await Spot.findAll({
        where: {lat: {[Op.lte]: maxLat}}})
        for (const lat of lats ){
         list.push(lat.id)
        }
        console.log(list)
  }

  if(maxLng) {
    if(isNaN(parseInt(+maxLng)) || (maxLng < -180 || maxLng > 180)){
      errors.maxLng = "Maximum longitude is invalid"
    }
      const lngs = await Spot.findAll({
        where: {lng: {[Op.lte]: maxLng}}})
        for (const lng of lngs ){
         list.push(lng.id)
        }
        console.log(list)
  }

  if(minLng) {
    if(isNaN(parseInt(+minLng)) || (minLng < -180 || minLng > 180)){
      errors.minLng = "Minimum longitude is invalid"
    }
      const lngs = await Spot.findAll({
        where: {lng: {[Op.gte]: minLng}}})
        for (const lng of lngs ){
         list.push(lng.id)
        }   console.log(list)
  }

  if(minPrice){
    if(isNaN(parseInt(+minPrice)) || (minPrice < 0)){
      errors.minPrice = "Minimum price must be greater than or equal to 0"
    }
      const prices = await Spot.findAll({
        where: {price: {[Op.gte]: minPrice}}})
        for (const price of prices ){
         list.push(price.id)
        }   console.log(list)
  }

  if(maxPrice){
    if(isNaN(parseInt(+maxPrice)) || (maxPrice < 0)){
      errors.maxPrice = "Maximum price must be greater than or equal to 0"
    }
      const prices = await Spot.findAll({
        where: {price: {[Op.lte]: maxPrice}}})
        for (const price of prices ){
         list.push(price.id)
        }   console.log(list)
  }
//finding duplicate ids
  const finalList = []
  const set = {}
  
  list.forEach(id => {
      if(id in set){
          set[id]++
      }else{
      set[id] = 1
      }
  })
  
  for(let id in set){
      if (set[id] > 1){
          finalList.push(id)
      }
  }

  const Spots = await Spot.findAll({
    where:{
      id: finalList
    },
    attributes: {
      include: ["avgRating", "previewImg"]
    },
    limit: size,
    offset: size * (page - 1)
  })

  await update(Spots)

if(Object.keys(errors).length)
{return res.status(400).json({"message": "Bad Request", errors})}
  else {return res.json({Spots, page, size})};
  });

  //GET Current User Spots
  router.get(
    '/current',
    async (req, res) => {
      const { user } = req;
      if(!user){
        return res.status(401).json({ "message": "Authentication required"})}
    const currentUsers = await Spot.findAll(
        {where: {ownerId: user.id},
          attributes: {
            include: ["avgRating", "previewImg"]
          }},
        
        )
    // await update(currentUsers)

    return res.json(currentUsers)
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
        price,
        avgRating: 0
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
    if (!currentSpot){res.status(404).json({"message": "Spot couldn't be found"})};
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
  validateImg,
  async (req, res) => {
    const { user } = req;
    const id = req.params.spotid;
    const {url, preview} = req.body    
    const spot = await Spot.findByPk(id)
    const spotImages = await SpotImage.findAll({where: {spotId: id}})
    if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
    if(!user){return res.status(401).json({ "message": "Authentication required"})}
    if (user.id !== spot.ownerId) {return res.status(403).json({"message": "Forbidden"})}
    // console.log(spotImages)
    if(preview){
      spotImages.forEach((si) => {
        si.preview = false
        si.save()
      })
    }
    let tf = preview
    if(preview === "" | preview === "true"){tf = true}
    
    const newSpot = await SpotImage.create({
      spotId: id,
      url,
      preview: tf
    })
    return res.json({
      id,
      url,
      preview: tf
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
    if(!spot) {return res.status(404).json({"message": "Spot couldn't be found"})}
    if (!user) {return res.status(401).json({ "message": "Authentication required"})}    
    if (user.id !== spot.ownerId) {return res.status(403).json({"message": "Forbidden"})}

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
  if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
  if (!user) {return res.json(401, {"message": "Authentication required"})}
  if (user.id !== spot.ownerId) {return res.status(403).json({"message": "Forbidden"})}

 

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
  const id = req.params.spotid;
  const {review, stars} = req.body;
  const spot = await Spot.findByPk(id)
  if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
  if(!user){return res.status(401).json({ "message": "Authentication required"})}
  const foundReview = await Review.findOne({where: {userId: user.id, spotId: id}})
  if(foundReview) {return res.status(500).json({"message": "User already has a review for this spot"})}
  const newReview = await Review.create(
    {userId: user.id,
    spotId: id,
    review,
    stars
  })

  await newReview.save()

  return res.json(newReview)
})

//Delete a Spot Image
router.delete('/:spotid/image', async(req, res) => {
  const {user} = req;
  const id = req.params.spotid;
  const spot = await Spot.findByPk(id, {
    attributes: {
      include: ["avgRating", "previewImg"]
    }
  })

  if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
  if (!user) {return res.status(401).json({"message": "Authentication required"})}
  if (user.id !== spot.ownerId) {return res.status(403).json({"message": "Forbidden"})}

  const img = await SpotImage.findOne({where: 
    {spotId: spot.id,
    preview: true}
  })

  const newImg = await SpotImage.findOne({
    where: {spotId: spot.id,
    preview: false},
    order: [[ 'createdAt', 'DESC' ]]
  })

  newImg.preview = true;

  newImg.save()

  await img.destroy()

  return res.json({
    "message": "Successfully deleted"
  })
})

//Get all images by spotid
router.get('/:spotid/image', async(req, res) => {
  const id = req.params.spotid;
  const spot = await Spot.findByPk(id, {
    attributes: {
      include: ["avgRating", "previewImg"]
    }
  })
  const img = await SpotImage.findAll({
    where: {
      spotId: id
      }
    })
  return res.json(img)
})

module.exports = router;

