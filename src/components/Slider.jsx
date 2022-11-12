import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Navigation, Pagination, Scrollbar } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/bundle';
import Spinner from './Spinner'


function Slider() {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    const navigate = useNavigate()
    
    useEffect(() => {
        const getListings = async () => {
            const listingRef = collection(db, 'listings')
            const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q)
           
            let listings = []
            querySnap.forEach((doc) => {
                listings.push({
                    'id': doc.id,
                    'data': doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }
        getListings()
    }, [])

    if (loading) {
        return <Spinner />
    }

    if (listings.length) {
        return <></>
    }

    if (listings) {
        return <>
            <p className='exploreHeading'>Recommended</p>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar]}
                slidesPerView={1}
                pagination={{clickable: true}}
            >
                {listings.map(({id, data}) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div
                            className="swiperSlideDiv"
                            style={{
                                background: `url(${data.imageUrls[0]}) center no-repeat`,
                                backgroundSize: 'cover',
                                height: '300px'
                            }}
                        >
                            <p className="swiperSlideText">{data.name}</p>
                            <p className="swiperSlidePrice">
                                ${(data.discountedPrice ?? data.regularPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                {' '}
                                {data.type === 'rent' && '/ month'}
                            </p>
                        </div>

                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    }
}
export default Slider