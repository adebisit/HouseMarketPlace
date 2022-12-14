import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import OAuth from "../components/OAuth"
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { toast } from 'react-toastify'



function SignIn() {
    const [ showPassword, setShowPassword ] = useState(false)
    const [ formData, setFormData ] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formData
    const navigate = useNavigate()
    
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const signIn = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            console.log(userCredential)
            if (userCredential.user) {
                navigate('/')
            }
        } catch (error) {
            toast.error('Bad User Credentials')
        }

    }

    return (
        <>
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Welcome Back</p>
            </header>
            <main>
                <form onSubmit={signIn}>
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
                    <Link to='/forgot-password' className="forgotPasswordLink">
                        Forgot Password
                    </Link>
                    <div className="signInBar">
                        <p className="signInText">
                            Sign In
                        </p>
                        <button className="signInButton">
                            <ArrowRightIcon fill='#fff' width='34px' height='34px' />
                        </button>
                    </div>
                </form>
                <OAuth />
                <Link to='/sign-up' className='registerLink'>Sign Up Instead</Link>
            </main>
        </div>
        </>
    )
}
export default SignIn