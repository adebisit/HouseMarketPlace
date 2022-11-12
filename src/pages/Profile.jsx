import { confirmPasswordReset, getAuth } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { updateDoc, doc, collection, query, getDocs, orderBy, where, deleteDoc, startAfter, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import { updateProfile } from 'firebase/auth'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'


function Profile() {
    const navigate = useNavigate()
    const auth = getAuth()

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastListing, setLastListing] = useState(null)
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingRef = collection(db, 'listings')
            const q = query(
                listingRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc'),
                limit(1)
            )
            const querySnap = await getDocs(q)
            const listings = []

            querySnap.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLastListing(querySnap.docs[querySnap.docs.length - 1])
            setLoading(false)
        }
        fetchUserListings()
    }, [auth.currentUser.uid])


    const loadMoreListings = async () => {
        const listingRef = collection(db, 'listings')
        const q = query(
            listingRef,
            where('userRef', '==', auth.currentUser.uid),
            orderBy('timestamp', 'desc'),
            startAfter(lastListing)
        )
        const querySnap = await getDocs(q)
        if (querySnap.docs.length === 0) {
            setLastListing(null)
            return
        }
        
        const listings = []

        querySnap.forEach((doc) => {
            listings.push({
                id: doc.id,
                data: doc.data()
            })
        })
        console.log("New Listing")
        console.log(listings)
        setListings((prev) => {
            return [...prev, ...listings]
        })
        setLastListing(querySnap.docs[querySnap.docs.length - 1])
    }

    const logOut = () => {
        auth.signOut()
        navigate('/')
    }

    const onChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const editListing = (listingId) => {
        navigate(`/edit-listing/${listingId}`)
    }

    const deleteListing = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            await deleteDoc(doc(db, 'listings', listingId))
            // const updatedListings = listings.filter((listing) => (listing.id !== listingId))
            setListings((prev) => (
                prev.filter(
                    (listing) => (listing.id !== listingId))
                )
            )
            toast.success('Listing Deleted')
        }
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
            }
            await updateDoc(doc(db, 'users', auth.currentUser.uid), { name: name })
            toast.success('Profile Updated')
        } catch (err) {
            toast.error('Could not Update Profile Details')
        }
    }

    return (
        <div className='profile'>
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type='button' className="logOut" onClick={logOut}>Logout</button>
            </header>
            <main>
                <div className='profileDetailsHeader'>
                    <p className="profileDetailsText">Personal Details</p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails((prev) => !prev)
                    }}>{changeDetails ? 'Done' : 'Change'}</p>
                </div>
                <div className="profileCard">
                    <form action="">
                        <input
                            id="name"
                            className={ changeDetails ? 'profileNameActive' : 'profileName'}
                            type="text"
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input
                            id="email"
                            className={ changeDetails ? 'profileEmailActive' : 'profileEmail'}
                            type="text"
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>
                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt='home' />
                    <p>Sell or Rent Your Home</p>
                    <img src={arrowRight} alt='arrow right' />
                </Link>
                {!loading && listings?.length > 0 && 
                    <>
                        <p className="listingText">Your Listings</p>
                        <ul className='listingsList'>
                            {listings.map((listing) => (
                                <ListingItem
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                    onDelete={() => deleteListing(listing.id)}
                                    onEdit={() => editListing(listing.id)}
                                />
                            ))}
                        </ul>
                    </>
                }
                {lastListing && <p className='loadMore' onClick={loadMoreListings}>Load More</p>}
            </main>
        </div>
    )
  }
  export default Profile