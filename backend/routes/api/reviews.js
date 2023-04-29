const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Review, ReviewImage, User, Spot} = require('../../db/models')

const router = express.Router();

const validateReviewImg = [
    check('url')
        .isURL()
        .withMessage("URL is invalid"),
        handleValidationErrors
]

const validateEdit = [
    check('stars')
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
            attributes: ["id", "firstName", "lastname"]},
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
    const id = req.params.reviewid;
    const {url} = req.body;
    const review = await Review.findByPk(id)
    if(!user) {return res.status(401).json({ "message": "Authentication required"})}
    if(review.userId !== user.id){return res.status(403).json({"message": "Forbidden"})}
    if(!review){return res.status(404).json({"message": "Review couldn't be found"})}
    let count = 0
    const reviewImgs = await ReviewImage.findAll({where: {reviewId: id}})
    for (const rImg of reviewImgs) {
        count++
    }
    if (count > 10){
        return res.status(403).json({"message": "Maximum number of images for this resource was reached"})
    }
    const newRevImg = await ReviewImage.create({reviewId: id, url });

    let result = ({
        reviewId: id,
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
          "message": "Spot couldn't be found"
        })
      }
    if(!user){
        return res.status(401).json({"message": "Authentication required"})
    }
    if(rev.userId !== user.id){
        return res.status(403).json({"message": "Forbidden"})
    }
    if(review) {rev.review = review};
    if(stars) {rev.stars = stars}

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
          "message": "Spot couldn't be found"
        })
      }
      if (!user){return res.json(401).json({"message": "Authentication required"})}
      if (user.id !== review.userId) {return res.json(404).json({"message": "Forbidden"})}
            await review.destroy()
            return res.json({
              "message": "Successfully deleted"
            })
})



module.exports = router;