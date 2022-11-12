import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from 'react-toastify'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from '../firebase.config'
import OAuth from "../components/OAuth"
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'


function SignUp() {
    const [ showPassword, setShowPassword ] = useState(false)
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = formData
    const navigate = useNavigate()
    const location = useLocation()
    
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredentials = await createUserWithEmailAndPassword(
                auth, email, password
            )
            const user = userCredentials.user
            updateProfile(auth.currentUser, {
                displayName: name,
            })

            const formDatatCopy = {...formData, timestamp: serverTimestamp()}
            delete formDatatCopy.password
            await setDoc(doc(db, 'users', user.uid), formDatatCopy )
            navigate('/')
        } catch (err) {
            toast.error('Registration Failed.')
        }
    }

    return (
        <>
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Sign Up</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <input
                        id="name"
                        type="text"
                        className="nameInput"
                        placeholder="Name"
                        value={name}
                        onChange={onChange}
                    />
                    <input
                        id="email"
                        type="text"
                        className="emailInput"
                        placeholder="Email"
                        value={email}
                        onChange={onChange}
                    />
                    <div className="passwordInputDiv">
                        <input
                            id='password'
                            type={ showPassword ? 'text' : 'password' }
                            className='passwordInput'
                            placeholder="Password"
                            value={password}
                            onChange={onChange}
                        />
                        <img
                            src={visibilityIcon}
                            alt="showPassword"
                            className="showPassword"
                            onClick={() => setShowPassword((prevState) => !prevState)}
                        />
                    </div>
                    { location.pathname === '/sign-in' && (<Link to='/forgot-password' className="forgotPasswordLink">
                        Forgot Password
                    </Link>)}
                    <div className="signInBar">
                        <p className="signInText">
                            Sign Up
                        </p>
                        <button className="signInButton">
                            <ArrowRightIcon fill='#fff' width='34px' height='34px' />
                        </button>
                    </div>
                </form>
                <OAuth />
                <Link to='/sign-in' className='registerLink'>Sign In Instead</Link>
            </main>
        </div>
        </>
    )
}
export default SignUp