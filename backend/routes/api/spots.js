const express = require('express');
const router = express.Router();

const {Spot, SpotImage, Review} = require("../../db/models")

//GET All Spots
  router.get('/',
  async (req, res) => {
 
    const allSpots = await Spot.findAll({
        include: [
            { model: SpotImage},
        ]
    });

    allSpots.forEach(async (spot) => {
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

    res.json(allSpots)
  });

  //GET Current User Spots

  router.get(
    '/current',
    async (req, res) => {
      const { user } = req;
      if (user) {
        const currentUser = await Spot.findByPk(user.id,{
            include: [{
                model: SpotImage
            }]
        })
        
        return res.json(currentUser);
      } else return res.json({ user: null });
    }
  );


module.exports = router;