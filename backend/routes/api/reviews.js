const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Review, ReviewImage, User, Spot} = require('../../db/models')

const router = express.Router();

const validateReviewImg = [
    check('url')
        .isURL()
        .withMessage("URL is invalid"),
    check('url')
        .exists({ checkFalsy: true })
        .withMessage("URL is required"),
        handleValidationErrors
]

const validateEdit = [
  check('stars')
    .custom((value, { req }) => {
        if((value > 5 || value < 1)){
            throw new Error ('Stars must be an integer from 1 to 5')
        }
return true}),
  check('review')
  .custom((value, { req }) => {
    if(value && !value.trim().length){
        throw new Error ("Review text is required")
    }
return true}),
    handleValidationErrors
  ]

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

//Get all Reviews of the Current User
router.get('/current', async (req, res) => {
    const {user} = req;
    if (!user) {
        return res.status(401).json({"message": "Authentication required"})
    }
    const Reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {model: User,
            attributes: ["id", "firstName", "lastName"]},
            {model: Spot,
            attributes: {exclude: ['createdAt', "updatedAt", "description"]}},
            {model: ReviewImage, 
            attributes: ["id", "url"]}
        ]
    })


    return res.json({Reviews})
})

// Add an Image to a Review based on the Review's id
router.post('/:reviewid/images', validateReviewImg, async (req, res) => {
    const {user} = req
    const reviewid = req.params.reviewid;
    const {url} = req.body;
    const review = await Review.findByPk(reviewid)
    if(!review){return res.status(404).json({"message": "Review couldn't be found"})}
    if(!user) {return res.status(401).json({ "message": "Authentication required"})}
    if(review.userId !== user.id){return res.status(403).json({"message": "Forbidden"})}
    let count = 0
    const reviewImgs = await ReviewImage.findAll({where: {reviewId: reviewid}})
    for (const rImg of reviewImgs) {
        count++
    }
    if (count > 10){
        return res.status(403).json({"message": "Maximum number of images for this resource was reached"})
    }
    const newRevImg = await ReviewImage.create({reviewId: reviewid, url });
    newid = newRevImg.id
    let result = ({
        id: newid,
        url
    })
    res.json(result)
})

//Edit a Review
router.put('/:reviewid', validateEdit, async (req, res) => {
    const id = req.params.reviewid;
    const {user} = req
    const {review, stars} = req.body
    const rev = await Review.findByPk(id);
    if(!rev){
        return res.status(404).json({
          "message": "Review couldn't be found"
        })
      }
    if(!user){
        return res.status(401).json({"message": "Authentication required"})
    }
    if(rev.userId !== user.id){
        return res.status(403).json({"message": "Forbidden"})
    }

    if(review) {rev.review = review};
    if(stars) {rev.stars = Number(stars)}

    await rev.save()

    return res.json(rev)
})

//Delete a Review
router.delete('/:reviewid', async (req, res) => {
    const {user} = req;
    const id = req.params.reviewid
    const review = await Review.findByPk(id)
    if(!review){
        return res.status(404).json({
          "message": "Review couldn't be found"
        })
      }
      if (!user){return res.json(401).json({"message": "Authentication required"})}
      if (user.id !== review.userId) {return res.json(403).json({"message": "Forbidden"})}
            await review.destroy()
            return res.json({
              "message": "Successfully deleted"
            })
})

//Delete a Review Image
router.delete('/:reviewid/:imageid', async(req, res) => {
    const {user} = req;
    const id = req.params.reviewid;
    const imgid = req.params.imageid;
    const review = await Review.findByPk(id)
    const image = await ReviewImage.findOne({where: {id: imgid}})
    if(!image) {return res.status(404).json({"message": "Review Image couldn't be found"})}
    if(!review) {return res.status(404).json({"message": "Revieçw couldn't be found"})}
    if (!user) {return res.json(401, {"message": "Authentication required"})}
    if (user.id !== review.userId) {return res.status(403).json({"message": "Forbidden"})}
  
    const img = await ReviewImage.findOne({where: {reviewId: review.id}
    })
    
    await img.destroy()
  
    return res.json({
      "message": "Successfully deleted"
    })
  })

//Get all Review Images by Spot id
router.get('/:reviewid/image', async(req, res) => {
    const id = req.params.reviewid;
    const review = await Review.findByPk(id)
    const allImg = await ReviewImage.findAll()

    const img = await ReviewImage.findAll({where: {reviewId: review.id}})
        return res.json(parseFloat(id))
      })

//Get all Reviews by a Spot's id
router.get('/spots/:spotid', async(req, res) => {
  const id = req.params.spotid;
  const spot = await Spot.findByPk(id);
  if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
  const Reviews = await Review.findAll({
    where: {
      spotId: spot.id
  },
  include: [
      {model: User,
      attributes: ["id", "firstName", "lastName"]},
      {model: ReviewImage, 
      attributes: ["id", "url"]}
  ]
  })
return res.json(Reviews)
})

//Create a Review for a Spot based on the Spot's id
router.post('/spots/:spotid', validateReviews, async(req, res, next) => {
  const {user} = req;
  const {review, stars} = req.body;
  if(!user){return res.status(401).json({"message": "Authentication required"})}
  const id = req.params.spotid;
  const spot = await Spot.findByPk(id)
  if(!spot){return res.status(401).json({"message": "Spot couldn't be found"})}

  //Review from the current user already exists for the Spot
  const rev = await Review.findOne({where: {spotId: id}})
  if(rev && (rev.userId === user.id)){
    return res.status(500).json({"message": "User already has a review for this spot"})}

  const newReview = await Review.create(
    {userId: user.id,
    spotId: id,
    review,
    stars: Number(stars)
  })

  await newReview.save()

  return res.json(newReview)
})

module.exports = router;