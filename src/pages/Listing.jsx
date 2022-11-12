import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle';
import { getDoc, doc } from "firebase/firestore"
import { db } from "../firebase.config"
import { getAuth } from "firebase/auth"
import Spinner from "../components/Spinner"
import shareIcon from '../assets/svg/shareIcon.svg'


function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkedCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setListing(docSnap.data())
                console.log(docSnap.data())
            }
            setLoading(false)
        }
        fetchListing()
    }, [navigate, params.listingId])

    if (loading) {
        return <Spinner />
    }
     
    return (
        <main>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
            >
                {listing.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="swiperSlideDiv"
                            style={{
                                background: `url(${url}) center no-repeat`,
                                backgroundSize: 'cover',
                                height: '300px'
                            }}
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="shareIconDiv" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkedCopied(true)
                setTimeout(() => {
                    setShareLinkedCopied(false)
                }, 2000)
            }}>
                <img src={shareIcon} alt="shareIcon" />
            </div>
            {shareLinkCopied && <p className="linkCopied">Link Copied</p>}

            <div className="listingDetails">
                <p className="listingName">{listing.name} - ${(listing.offer ? listing.discountedPrice : listing.regularPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                <p className="listingLocation">{listing.location}</p>
                <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
                {listing.offer && <p className="discountPrice">${listing.regularPrice - listing.discountedPrice} Discount</p>}
                <ul className="listingDetailsList">
                    <li>{listing.bedrooms} Bedroom{listing.bedrooms > 1 && 's'}</li>
                    <li>{listing.bathrooms} Bedroom{listing.bathrooms > 1 && 's'}</li>
                    {listing.parking && <li>Parking Spot</li>}
                    {listing.furnished && <li>Furnished Spot</li>}
                </ul>
                <p className="listingLocationTitle">Location</p>
                <div className="leafletContainer">
                    <MapContainer
                        style={{height: '100%', width: '100%'}}
                        center={[listing.geolocation.lat, listing.geolocation.lng]}
                        zoom={13}
                        scrollWheelZoom={false }
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                        />
                        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                            <Popup>{listing.location}</Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {auth.currentUser?.uid !== listing.userRef && 
                    <Link
                        className='primaryButton'
                        to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                    >
                        Contact Landlord
                    </Link>}
            </div>
        </main>
    )
}
export default Listing