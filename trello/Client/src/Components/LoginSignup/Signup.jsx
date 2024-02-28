import React, { useState } from 'react';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import astro from '../../images/Astro.png';
import nameIcon from '../../images/NameIcon.png'
import mailIcon from '../../images/EmailIcon.png'; 
import lockIcon from '../../images/LockIcon.png';
import eyeIcon from '../../images/view.png';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
    setNameError('');
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError('');
  };

  const handleRegister = () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setPasswordMatchError('');
    setLoading(true); 

    if (!name) {
      setNameError('Name is required');
      setLoading(false); 
      return; 
    }
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
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password is required');
      setLoading(false); 
      return; 
    }

    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      setLoading(false); 
      return; 
    }

    axios.post('https://promanageapi.onrender.com/auth/Signup', { name, email, password }) 
      .then(response => {
        console.log(response.data);
        navigate('/login');
      })
      .catch(error => {
        console.error(error.response.data);
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  const handleLoginClick = () => {
    navigate('/login')
  }

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
            <div className={styles.textheader}>Register</div>
        </div>

        <div className={styles.inputWrapper}>
            <img src={nameIcon} alt="Name Icon" style={{ width: '20px', height: '20px', marginTop:'11px', marginLeft: '10px' }} />
            <input type="text" placeholder="Name" className={styles.nameInput} value={name} onChange={handleChangeName} />   
        </div>
        {nameError && <div className={styles.error}>{nameError}</div>}

        <div className={styles.inputWrapper}>
            <img src={mailIcon} alt="Mail Icon" style={{ width: '20px', height: '20px', marginTop:'11px', marginLeft: '10px' }} />
            <input type="email" placeholder="Email" className={styles.emailInput} value={email} onChange={handleChangeEmail} />     
        </div>
        {emailError && <div className={styles.error}>{emailError}</div>}

        <div className={styles.inputWrapper}>
            <img src={lockIcon} alt="Lock Icon" style={{ width: '20px', height: '20px', marginTop:'11px', marginLeft: '10px' }} />
            <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password" 
            className={styles.passwordInput} 
            value={password} 
            onChange={handleChangePassword}
          />
          <img 
            src={eyeIcon} 
            alt="Eye Icon" 
            className={styles.eyeIcon} 
            onClick={togglePasswordVisibility} 
          />
        </div>
        {passwordError && <div className={styles.error}>{passwordError}</div>}

        <div className={styles.inputWrapper}>
            <img src={lockIcon} alt="Lock Icon" style={{ width: '20px', height: '20px', marginTop:'11px', marginLeft: '10px' }} />
            <input 
            type={showConfirmPassword ? 'text' : 'password'} 
            placeholder="Confirm Password" 
            className={styles.confpasswordInput} 
            value={confirmPassword} 
            onChange={handleChangeConfirmPassword}
          />
          <img 
            src={eyeIcon} 
            alt="Eye Icon" 
            className={styles.eyeIcon} 
            onClick={toggleConfirmPasswordVisibility} 
          />
        </div>
        {confirmPasswordError && <div className={styles.error}>{confirmPasswordError}</div>}
        {passwordMatchError && <div className={styles.error}>{passwordMatchError}</div>}

        <div className={styles.buttonsdiv}>
          <button className={styles.registerButton} onClick={handleRegister}>
            {loading ? 'Loading' : 'Register'} 
          </button>
          <span className={styles.noAccount}>Have an account?</span>
          <button className={styles.loginButton} onClick={handleLoginClick}>Login</button>
        </div>
      </div>  
    </div>
  );
}
