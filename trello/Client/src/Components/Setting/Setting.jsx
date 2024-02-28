import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Setting.module.css';
import nameIcon from '../../images/NameIcon.png';
import lockIcon from '../../images/LockIcon.png';
import eyeIcon from '../../images/view.png';
import axios from 'axios'; 
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

export default function Setting() {
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeOldPassword = (e) => {
    setOldPassword(e.target.value);
  };

  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !oldPassword || !newPassword) {
        throw new Error('Name, old password, and new password cannot be empty');
      }
      
      const authToken = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/auth/update', {
        name: name,
        oldPassword: oldPassword,
        newPassword: newPassword
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.status === 200) {
        toast.success('Details updated successfully');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(error.message);
    }
  };

  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleUpdateButtonClick = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.leftside}>
        <Sidebar />
      </div>

      <div className={styles.rightside}>
        <h2 className={styles.Header}>Settings</h2>
        <div className={styles.Form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <img src={nameIcon} alt="" style={{ width: '30px', height: '30px', marginTop:'12px', marginLeft: '10px' }}/>
              <input type="text" placeholder="Name" className={styles.nameInput} value={name} onChange={handleChangeName} />
            </div>

            <div className={styles.inputWrapper}>
              <img src={lockIcon} alt="" style={{ width: '30px', height: '30px', marginTop:'12px', marginLeft: '10px' }} />
              <input type={showOldPassword ? 'text' : 'password'} placeholder="Old Password" className={styles.oldpassInput} value={oldPassword} onChange={handleChangeOldPassword} />
              <img src={eyeIcon} alt="" className={styles.eyeIcon} onClick={toggleShowOldPassword} />
            </div>

            <div className={styles.inputWrapper}>
              <img src={lockIcon} alt="" style={{ width: '30px', height: '30px', marginTop:'12px', marginLeft: '10px' }} />
              <input type={showNewPassword ? 'text' : 'password'} placeholder="New Password" className={styles.newpassInput} value={newPassword} onChange={handleChangeNewPassword} />
              <img src={eyeIcon} alt="" className={styles.eyeIcon} onClick={toggleShowNewPassword} />
            </div>

            <div className={styles.footerdiv}>
              <button type="button" className={styles.updateBtn} onClick={handleUpdateButtonClick}>Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
