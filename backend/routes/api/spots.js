const express = require('express');
const router = express.Router();

const {Spot} = require("../../db/models")

  router.get('/',
  async (req, res) => {
    const allSpots = await Spot.findAll({
    });
    // allSpots.forEach(async (spot) => {
    //     if(spot.previewImg){
    //         previewImg = "something"
    //     }
    // })
    allspots[1].previewImg = "N/A"
    res.json(allSpots)
  })

// Get All Spots
// router.get(
//     '/',
//     async (req, res) => {
//         const allSpots = await Spot.findAll();



//       const user = await User.create({ email, username, hashedPassword, firstName, lastName });
  
//       const safeUser = {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         username: user.username,
//       };

//       await setTokenCookie(res, safeUser);
  
//       return res.json({
//         user: safeUser
//       });
//     }
//   );

module.exports = router;