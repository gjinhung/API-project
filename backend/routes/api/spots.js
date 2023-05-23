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
  check('price')
    .custom((value, { req }) => {
        if(typeof value === "string" ||  value instanceof String){
            throw new Error ("price cannot be a string")
        }
return true}),
  check('lat')
    .custom((value, { req }) => {
        if(typeof value === "string" ||  value instanceof String){
            throw new Error ("lat cannot be a string")
        }
return true}),
  check('lng')
    .custom((value, { req }) => {
        if(typeof value === "string" ||  value instanceof String){
            throw new Error ("lng cannot be a string")
        }
return true}),
  handleValidationErrors
];

const validateSpotEdit = [
  check('lat')
    .custom((value, { req }) => {
    if(value < -90 || value > 90){
        throw new Error ("Latitude is not valid")
    }
return true}),
  check('lng')
  .custom((value, { req }) => {
    if(value < -180 || value > 180){
        throw new Error ("Longitude is not valid")
    }
return true}),
  check('name')
    .isLength({ max: 49 })
    .withMessage('Name must be less than 50 characters'),
  check('price')
    .custom((value, { req }) => {
        if(typeof value === "string" ||  value instanceof String){
            throw new Error ("Price must be a number")
        }
return true}),
  handleValidationErrors
];



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
    });//find an image of a spot where the preview boolean is true
    if(total/count){
    spot.avgRating = total/count}
    if(prevImg){  //if there is an old image marked true
    spot.previewImg = prevImg.url} //the spot's img = url
    else{prevImg.previewImg = "image url"}// if no one image marked true

    await spot.save()
}
}

//GET All Spots
  router.get('/',
  async (req, res) => {
    if(Object.keys(req.query).length === 0){
    const Spots = await Spot.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    });
    for (const spot of Spots) {
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
      });//find an image of a spot where the preview boolean is true
      if(total/count){
      spot.avgRating = total/count}
      if(prevImg){  //if there is an old image marked true
      spot.previewImg = prevImg.url} //their img
      else{spot.previewImg = "image url"}
  
      await spot.save()
  }
    return res.json({Spots})
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

  for (const spot of Spots) {
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
    });//find an image of a spot where the preview boolean is true
    if(total/count){
    spot.avgRating = total/count}
    if(prevImg){  //if there is an old image marked true
    spot.previewImg = prevImg.url} //their img
    else{spot.previewImg = "image url"}

    await spot.save()
}

if(Object.keys(errors).length)
{return res.status(400).json({"message": "Bad Request", errors})}
  else {return res.json({Spots, page, size})};
  });

//Get all Spots owned by the Current User
  router.get(
    '/current',
    async (req, res) => {
      const { user } = req;
      if(!user){
        return res.status(401).json({ "message": "Authentication required"})}
    const Spots = await Spot.findAll({where: {ownerId: user.id}})

    return res.json({Spots})
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
        price: Number(price.toFixed(2))
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
      price: Number(spot.price.toFixed(2))
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
    if(preview){ //if preview is marked true
      spotImages.forEach((si) => {
        si.preview = false //change the rest to false
        si.save()
      })
    }

    const newSpotImg = await SpotImage.create({
      spotId: id,
      url,
      preview
    })

    newid = newSpotImg.id

    return res.json({
      id: newid,
      url,
      preview
    })
  }
)

//Edit a Spot
router.put(
  ("/:spotid"),
  validateSpotEdit,
  async (req, res) => {
    const { user } = req;
    const id = req.params.spotid;
    const {address, city, state, country, lat, lng, name, description,price} = req.body
    const spot = await Spot.findByPk(id,{
      attributes:{
        exclude: ['avgRating', 'previewImg']
      }
    })
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
    if (price) {spot.price = Number(price.toFixed(2))}

    await spot.save()

    return res.json(spot
    )
  }
)

//Delete a Spot
router.delete('/:spotid', async(req, res) => {
  const {user} = req;
  const id = req.params.spotid;
  const spot = await Spot.findOne({where: {id: id}})
  if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
  if (!user) {return res.status(401).json({"message": "Authentication required"})}
  if (user.id !== spot.ownerId) {return res.status(403).json({"message": "Forbidden"})}

 

  await spot.destroy()
  return res.json({
    "message": "Successfully deleted"
  })
}
)

//Delete a Spot Image
router.delete('/:spotid/images/:imageid', async(req, res) => {
  const {user} = req;
  if (!user) {return res.json(401, {"message": "Authentication required"})}
  const id = req.params.spotid;
  const imageid = req.params.imageid
  const spot = await Spot.findByPk(id)
  if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
  if (user.id !== spot.ownerId) {return res.status(403).json({"message": "Forbidden"})}
  const image = await SpotImage.findByPk(imageid)
  if (!image) {return res.status(404).json({"message": "Spot Image couldn't be found"})}
  
  await image.destroy()

  const nextTrue = await SpotImage.findOne({order: [ [ 'id', 'DESC' ]]})
  nextTrue.preview = true

  await nextTrue.save()

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
      spotId: {[Op.gt]: id}
      }
    })
  return res.json(img)
})

module.exports = router;

