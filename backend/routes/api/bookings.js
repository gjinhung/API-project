const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Booking, User, Spot} = require('../../db/models');

const router = express.Router();

const validateBooking = [
    check('startDate')
        .isDate()
        .withMessage('Dates must be formated yyyy-mm-dd'),
        check('endDate')
        .isDate()
        .withMessage('Dates must be formated yyyy-mm-dd'),
    check('endDate')
        .custom((value, { req }) => {
            if(value <= req.body.startDate){
                throw new Error ("endDate cannot be on or before startDate")
            }
        return true}),
    handleValidationErrors
]

//Get all of the Current User's Bookings
router.get('/current', async (req, res) => {
    const {user} = req;
    if(!user){return res.status(401).json({"message": "Authentication required"})}
    const Bookings = await Booking.findAll({
        where: {userid: user.id}, 
        include: [
            {model: Spot,
            attributes: {exclude: ['createdAt', "updatedAt", "description","avgRating"]}},
        ]
    })
    return res.json({Bookings})
})

//Get all Bookings for a Spot based on the Spot's id
router.get('/spots/:spotid', async (req, res) => {
    const {user} = req
    const spotid = req.params.spotid
    const spot = await Spot.findByPk(spotid);
    if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
    if(!user){return res.status(401).json({"message": "Authentication required"})}
    //non owner
    if (user.id !== spot.ownerId) {
        const booking = await Booking.findAll({
            where: {spotId: spotid},
            attributes: ["spotId", "startDate", "endDate"]
        })
        return res.json({Bookings: booking})    
    }
    const booking = await Booking.findAll({
        where: {spotId: spotid},
        include: [
            {model: User,
            attributes: {exclude: ["username", "email", "hashedPassword", "createdAt", "updatedAt"]}
        }
        ]
    })
    return res.json({Bookings: booking})
    })

//Create a Booking from a Spot based on the Spot's id
router.post('/spots/:spotid', validateBooking, async (req, res) => {
    const {user} = req;
    const {startDate, endDate} = req.body
    if(!spot){return res.status(404).json({"message": "Spot couldn't be found"})}
    if(!user){return res.status(401).json({"message": "Authentication required"})}
    const spotid = req.params.spotid
    const spot = await Spot.findByPk(spotid);
    //cannot belong to user
    if(spot.ownerId === user.id){
        return res.status(403).json({"message": "Owner is not allowed to reserve their own spot"})
    }
     //Booking conflict
    const bookings = await Booking.findAll({
        where: {spotId: spotid}
    })
    //finding Booking where new start dates falls between old start and old end
    let start = false;
    let end = false;
    const errors = {}
    for (const booking of bookings) {
        let currentEnd = new Date(endDate).toJSON().slice(0,10);
        let currentStart = new Date(startDate).toJSON().slice(0,10);
        let from = new Date(booking.startDate);
        let to   = new Date(booking.endDate);
        let check1 = new Date(currentStart);
        let check2 = new Date(currentEnd)
        if (check1 >= from && check1 <=to) {start = true}
        if (check2 >= from && check2 <=to) {end = true}
    }
    if(start === true) {errors["startDate"] = "Start date conflicts with an existing booking"}
    if(end === true) {errors["endDate"] = "End date conflicts with an existing booking"}
    
    if(start || end) {return res.status(403).json(
        {"message": "Sorry, this spot is already booked for the specified dates", errors})}

        const newBooking = await Booking.create({
        spotId: spotid,
        userId: user.id,
        startDate,
        endDate
    })
    return res.json(newBooking)
})

// Edit a Booking
router.put('/:bookingid', validateBooking, async (req, res) => {
    const {user} = req;
    const {startDate, endDate} = req.body
    const id = req.params.bookingid;
    const booking = await Booking.findByPk(id);
    if(!booking){return res.status(404).json({"message": "Booking couldn't be found"})}
    if(!user){return res.status(401).json({"message": "Authentication required"})}
    
    if(user.id !== booking.userId){return res.status(403).json({"message": "Forbidden"})}

    let start = false;
    let end = false;
    const errors = {}
        let currentEnd = new Date(endDate).toJSON().slice(0,10);
        let currentStart = new Date(startDate).toJSON().slice(0,10);
        let from = new Date(booking.startDate);
        let to   = new Date(booking.endDate);
        let check1 = new Date(currentStart);
        let check2 = new Date(currentEnd)
        if (check1 >= from && check1 <=to) {start = true}
        if (check2 >= from && check2 <=to) {end = true}
    
    if(start === true) {errors["startDate"] = "Start date conflicts with an existing booking"}
    if(end === true) {errors["endDate"] = "End date conflicts with an existing booking"}
    
    if(start || end) {return res.status(403).json(
        {"message": "Sorry, this spot is already booked for the specified dates", errors})}

    if(booking.endDate < new Date().toJSON()){return res.status(403).json({"message": "Past bookings can't be modified"})}

    if(startDate) {booking.startDate = startDate};
    if(endDate) {booking.startDate = startDate}

    return res.json(booking)

})

//Delete a Booking
router.delete('/:bookingid', async (req, res) => {
    const {user} = req
    const id = req.params.bookingid;
    const booking = await Booking.findByPk(id)

    if(user.id !== booking.userId){return res.status(403).json({"message": "Forbidden"})}

    booking.destroy()

    return res.json({"message": "Successfully deleted"})
})

module.exports = router;