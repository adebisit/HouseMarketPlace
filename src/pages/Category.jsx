import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit, startAfter, getDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from 'react-toastify'
import Spinner from "../components/Spinner"
import ListingItem from "../components/ListingItem"


function Category() {
    const [ listings, setListings ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingRef = collection(db, 'listings')
                const q = query(
                    listingRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )
                const querySnap = await getDocs(q)
                
                const listings = []
                querySnap.forEach(doc => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings)
                setLoading(false)
            } catch (error) {
                console.log(error)
                toast.error('Could not fetch Listings')
            }
        }
        fetchListings()
    }, [params.categoryName])

    return <div className="category">
        <header>
            <p className="pageHeader">
                {params.categoryName === 'rent' ? 'Plaes for Rent' : 'Pages for Sales'}
            </p>
        </header>
        {
            loading ? <Spinner /> : listings && listings.length === 0 ? <p>No listings for {params.categoryName}</p> : <>
                <main>
                    <ul className="catgeoryListings">
                        {listings.map((listing) => (
                            <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                        ))}
                    </ul>
                </main>
            </>
        }
    </div>
}
export default Category