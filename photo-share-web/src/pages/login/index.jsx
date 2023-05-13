import logo from './logo.svg';
import './App.css';
import background from './login-background.jpg'
import { useState } from 'react';
import Network from '../../Network';

const DEFUALT_DETAILS = {
  email: '',
  password: '',
  username: ''
}

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [alertMessage, setAlertMessage] = useState('')

  const [details, setDetails] = useState(DEFUALT_DETAILS)


  const onChange = (event) => {
    const updatedDetails = { ...details }
    updatedDetails[event.target.name] = event.target.value
    setDetails(updatedDetails)
  }

  const showAlert = (message) => {
    setAlertMessage(message)
    setTimeout(() => {
      setAlertMessage('')
    }, 3500)
  }

  const onButtonPress = async () => {
    if (isLogin) {
      const result = await Network.post('login', {
        email: details.email,
        password: details.password
      })
      if (result.data.success) {
        localStorage.setItem('authToken', result.data.token)
        window.location.href = "/home"
      } else {
        showAlert(result.data.message)
      }
    } else {

      const result = await Network.post('register', {
        email: details.email,
        password: details.password,
        name: details.username
      })
      if (result.data.success) {
        localStorage.setItem('authToken', result.data.token)
        window.location.href = "/home"
      } else {
        showAlert(result.data.message)
      }
    }
  }

  const renderLogin = () => {
    return <>
      <div class="mb-3">
        <input
          type="email"
          name='email'
          class="form-control p-3"
          placeholder="Email address"
          value={details.email}
          onChange={onChange}
        />
      </div>
      <div class="mb-3">
        <input
          type="password"
          name='password'
          class="form-control p-3"
          placeholder="Password"
          value={details.password}
          onChange={onChange}
        />
      </div></>
  }

  const renderRegister = () => {
    return <>
      <div class="mb-3">
        <input
          class="form-control p-3"
          name='username'
          value={details.username}
          onChange={onChange}
          placeholder="Username" />
      </div>
      <div class="mb-3">
        <input
          type="email"
          class="form-control p-3"
          name='email'
          value={details.email}
          onChange={onChange}
          placeholder="Email address" />
      </div>
      <div class="mb-3">
        <input
          class="form-control p-3"
          name='password'
          value={details.password}
          onChange={onChange}
          placeholder="Password" />
      </div>
    </>
  }

  return (
    <div className="App">
      <div className="row">
        <img src={background} className="col-8 border img-fluid bg-purple" style={{
          backgroundImage: 'linear-gradient(to right bottom, #8e00ff, #00ffdb)'
        }} />

        <div class="col-4 p-4 text-black d- flex">
          <div class="d-flex align-items-start mb-3 pb-1">
            <span class="h1 fw-bold mb-0">{isLogin ? "Login" : "Sign Up"}</span>
          </div>
          {
            isLogin ? renderLogin() : renderRegister()
          }
          {!!alertMessage && <div class="alert alert-danger" role="alert">
            {alertMessage}
          </div>}

          <button
            className='btn fw-bold btn-primary'
            onClick={onButtonPress}
            style={{ backgroundImage: 'linear-gradient(to right bottom, rgb(0 178 244), rgb(91 151 229))' }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <div className='mt-3'>
            <p>{isLogin ? "Don't have a account ? " : "Already have an accont ? "}<span
              onClick={() => {
                setIsLogin(!isLogin)
                setDetails({ ...DEFUALT_DETAILS })
              }} className='link-primary fw-bold'>{isLogin ? "Sign Up" : "Login"}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
