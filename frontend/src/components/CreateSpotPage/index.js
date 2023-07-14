import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMenu } from '../../context/ShowMenuContext';
import * as spotActions from '../../store/spots'

import './CreateSpotPage.css'

const CreateSpotPage = () => {
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [prevImg, setPrevImg] = useState({ url: '', preview: true });
    const [img1, setImg1] = useState({ url: '', preview: false });
    const [img2, setImg2] = useState({ url: '', preview: false });
    const [img3, setImg3] = useState({ url: '', preview: false });
    const [img4, setImg4] = useState({ url: '', preview: false });
    const [lat, setLat] = useState(0)
    const [lng, setLng] = useState(0)
    const [errorsList, setErrorsList] = useState({})
    const dispatch = useDispatch();
    const history = useHistory();

    const { setShowMenu } = useMenu();

    let errors = {}

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Number(price)) { setPrice(0) }

        if (!country) { errors.country = "Country is required" }

        if (!address) { errors.address = "Address is required" }

        if (!city) { errors.city = "City is required" }

        if (!state) { errors.state = "State is required" }

        if (description.length < 30) { errors.description = "Description needs a minimum of 30 characters" }

        if (!name) { errors.name = "Name is required" }

        if (name.length > 49) { errors.name = "Name must be less than 50 characters" }

        if (!price) { errors.price = "Price is required" }

        if (!prevImg.url) { errors.prevImg = "Preview image is required" }

        if (prevImg.url && (!prevImg.url.endsWith('.png') && !prevImg.url.endsWith('.jpg') && !prevImg.url.endsWith('.jpeg'))) {
            errors.prevImg = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if (img1.url && (!img1.url.endsWith('.png') && !img1.url.endsWith('.jpg') && !img1.url.endsWith('.jpeg'))) {
            errors.img1 = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if (img2.url && (!img2.url.endsWith('.png') && !img2.url.endsWith('.jpg') && !img2.url.endsWith('.jpeg'))) {
            errors.img2 = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if (img3.url && (!img3.url.endsWith('.png') && !img3.url.endsWith('.jpg') && !img3.url.endsWith('.jpeg'))) {
            errors.img3 = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if (img4.url && (!img4.url.endsWith('.png') && !img4.url.endsWith('.jpg') && !img4.url.endsWith('.jpeg'))) {
            errors.img4 = "Image URL must end in .png, .jpg, or .jpeg"
        }

        if (!Object.keys(errors).length) {
            console.log(`no errors`)
            const spot = {
                address,
                city,
                state,
                country,
                name,
                lat,
                lng,
                description,
                price
            }

            const images = [
                prevImg,
                img1,
                img2,
                img3,
                img4
            ]

            let createSpot = await dispatch(spotActions.newSpot(spot))

            const spotId = createSpot.id
            images.forEach(image => {
                if (image.url) {
                    dispatch(spotActions.newImage({ spotId, image }))
                }
            })

            history.push(`/spots/${spotId}`);


        }
        setErrorsList(errors)
    }




    const formatPrice = (e) => {
        let newPrice = Number(e.target.value)
        if (!newPrice) { newPrice = 0 }

        setPrice(newPrice)
    }

    useEffect(() => {
        setShowMenu(false)
    }, [setShowMenu])

    const demoUser = () => {
        setCountry('USA');
        setAddress('Lt. Surge Road');
        setCity('Vermilion City');
        setState('Kanto');
        setDescription("The Vermilion Gym (Japanese: クチバジム Kuchiba Gym) is the official Gym of Vermilion City. It is based on Electric-type Pokémon. The Gym Leader is Lt. Surge. Trainers who defeat him receive the Thunder Badge.");
        setName("Vermilion City");
        setPrice(888);
        setPrevImg({ url: "https://i.ytimg.com/vi/2C1nwiKIR_M/hqdefault.jpg", preview: true });
        setImg1({ url: 'https://img.gamewith.net/article/thumbnail/rectangle/1866.jpg', preview: false });

    }


    return (
        <div className='createSpotPage'>
            <div className='spot-form'>
                <div className="demoButton">
                    <button onClick={demoUser} className="demouser">
                        Demo Spot
                    </button>
                </div>
                <div className='new-spot-page'>
                    <h1 className='title'>Create a new Spot</h1>
                    <h3>Where's your place located?</h3>
                    <h5>Guests will only get your exact address once they booked a reservation.</h5>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="spot-first-section">
                        <label>Country </label>
                        <span style={{ color: "red" }}>{errorsList.country}</span>
                        <input type="text"
                            value={country}
                            placeholder="Country"
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Street Address </label>
                        <span style={{ color: "red" }}>{errorsList.address}</span>
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className='cityState'>
                        <div className="city">
                            <label>City </label>
                            <span style={{ color: "red" }}>{errorsList.city}</span>
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div className='comma'> ,</div>
                        <div className='state'>
                            <label>State </label>
                            <span style={{ color: "red" }}>{errorsList.state}</span>
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='latLng'>
                        <div className='lat'>
                            <label>Latitude</label>
                            <input
                                type="text"
                                placeholder="Latitude"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                            />
                        </div>
                        <div className='comma'> ,</div>
                        <div className='lng'>
                            <label>Longitude</label>
                            <input
                                type="text"
                                placeholder="Longitude"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                            />
                        </div>
                    </div>
                    <hr></hr>
                    <div className="spot-second-section">
                        <h3>Describe your place to guests</h3>
                        <h5>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h5>
                        <div>
                            <textarea
                                name="text"
                                rows={5}
                                cols={70}
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            >
                            </textarea>

                        </div>
                        <div style={{ color: "red" }}>{errorsList.description}</div>
                    </div>
                    <hr></hr>
                    <div className="spot-third-section">
                        <h3>Create a title for your spot</h3>
                        <h5>Catch guests' attention with a spot title that highlights what makes your place special.</h5>
                        <div>
                            <input
                                type="text"
                                placeholder="Name of your spot"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div style={{ color: "red" }}>{errorsList.name}</div>
                    </div>
                    <hr></hr>
                    <div className="spot-fourth-section">
                        <h3>Set a base price for your spot</h3>
                        <h5>Competitive pricing can help your listing stand out and rank higher in search results.</h5>
                        <div>
                            $
                            <input
                                type="text"
                                placeholder="Price per night (USD)"
                                // value={price}
                                onChange={formatPrice}
                            />
                        </div>
                        <div style={{ color: "red" }}>{errorsList.price}</div>
                    </div>
                    <hr></hr>
                    <div className="spot-fifth-section">
                        <h3>Liven up your spot with photos</h3>
                        <h5>Submit a link to at least one photo to publish your spot.</h5>
                        <div>
                            <input
                                type="text"
                                placeholder="Preview Image URL"
                                value={prevImg.url}
                                onChange={(e) => setPrevImg({ url: e.target.value, preview: true }
                                )}
                            />
                        </div>
                        <div style={{ color: "red" }}>{errorsList.prevImg}</div>
                        <div>
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={img1.url}
                                onChange={(e) => setImg1({ url: e.target.value, preview: false }
                                )}
                            />
                        </div>
                        <div style={{ color: "red" }}>{errorsList.img1}</div>
                        <div>
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={img2.url}
                                onChange={(e) => setImg2({ url: e.target.value, preview: false }
                                )}
                            />
                        </div>
                        <div style={{ color: "red" }}>{errorsList.img2}</div>
                        <div>
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={img3.url}
                                onChange={(e) => setImg3({ url: e.target.value, preview: false }
                                )}
                            />
                        </div>
                        <div style={{ color: "red" }}>{errorsList.img3}</div>
                        <div>
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={img4.url}
                                onChange={(e) => setImg4({ url: e.target.value, preview: false }
                                )}
                            />
                        </div>
                        <div style={{ color: "red" }}>{errorsList.img4}</div>
                    </div>
                    <hr></hr>
                    <div className='create-button'>
                        <button
                            className="create-button-content"
                            type="submit">Create Spot</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default CreateSpotPage