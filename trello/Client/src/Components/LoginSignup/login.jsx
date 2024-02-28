import React, { useState } from 'react';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import astro from '../../images/Astro.png';
import mailIcon from '../../images/EmailIcon.png'; 
import lockIcon from '../../images/LockIcon.png';
import eyeIcon from '../../images/view.png';

export default function Login({ setUserId }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = () => {
    navigate('/Signup');
  };

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');
    setLoading(true); 

    if (!email) {
      setEmailError('Email is required');
      setLoading(false);
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      setLoading(false); 
      return;
    }

    axios.post('https://promanageapi.onrender.com/auth/login', { email, password })
      .then(response => {
        console.log('Login successful:', response.data);
        const authToken = response.data.token;
        const userId = response.data.userId;

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userId', userId);

        setUserId(userId);
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Error during login:', error);;
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftside}>
        <div className={styles.astroImg}>
          <img className={styles.assImg} src={astro} alt="" />
        </div>

        <div className={styles.paraspan}>
          <p className={styles.para}>Welcome aboard my friend</p>
          <span className={styles.span}>Just a couple of clicks and we start</span>
        </div>
      </div>

      <div className={styles.rightside}>
        <div className={styles.header}>
            <div className={styles.textheader}>Login</div>
        </div>

        <div className={styles.inputWrapper}>
            <img src={mailIcon} alt="Mail Icon" style={{ width: '20px', height: '20px', marginTop:'11px', marginLeft: '10px' }} />
            <input 
              type="email" 
              placeholder="Email" 
              className={styles.emailInput} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        {emailError && <div className={styles.error}>{emailError}</div>}

        <div className={styles.inputWrapper}>
            <img src={lockIcon} alt="Lock Icon" style={{ width: '20px', height: '20px', marginTop:'11px', marginLeft: '10px' }} />
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              className={styles.passwordInput} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            <img 
              src={eyeIcon} 
              alt="Eye Icon" 
              className={styles.eyeIcon} 
              onClick={togglePasswordVisibility} 
            />
        </div>
        {passwordError && <div className={styles.error}>{passwordError}</div>}

        <div className={styles.buttonsdiv}>
          <button className={styles.loginButton} onClick={handleLogin}>
            {loading ? 'Loading' : 'Login'} 
          </button>
          <span className={styles.noAccount}>Don't have an account?</span>
          <button className={styles.registerButton} onClick={handleRegisterClick}>Register</button>
        </div>
      </div>  
    </div>
  );
}
