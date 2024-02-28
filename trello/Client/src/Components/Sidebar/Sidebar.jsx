import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css'
import pro from '../../images/promanage.png';
import board from '../../images/board.png';
import anal from '../../images/anal.png';
import setting from '../../images/settings.png';
import logout from '../../images/Logout.png';
import ConfirmationModal from '../Sidebar/ConfirmationLogoutModal/ConfirmationLogoutModal';

export default function Sidebar() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    navigate('/login');
    setShowModal(false);
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  const BoardBtn = () => {
    navigate('/dashboard')
  }

  const AnalyticsBtn = () => {
    navigate('/analytics')
  }

  const SettingBtn = () => {
    navigate('/setting')
  }

  return (
      <div className={styles.sidebar}>
        <div className={styles.Header}>
          <img src={pro} className={styles.proImg} alt="" />
          <h4 className={styles.header}>Pro Manage</h4>
        </div>

        <div className={styles.Board}>
          <img src={board} className={styles.boardImg} alt="" />
          <button className={styles.btn1} onClick={BoardBtn}>Board</button>
        </div>

        <div className={styles.Analytics}>
          <img src={anal} className={styles.analImg} alt="" />
          <button className={styles.btn2} onClick={AnalyticsBtn}>Analytics</button>
        </div>

        <div className={styles.Setting}>
          <img src={setting} className={styles.settingImg} alt="" />
          <button className={styles.btn3} onClick={SettingBtn}>Setting</button>
        </div>

        <div className={styles.footer}>
          <img src={logout} className={styles.logoutImg} alt="" />
          <button className={styles.btn4} onClick={handleLogout}>Logout</button>
        </div>

        <ConfirmationModal
        isOpen={showModal}
        message="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        />

       
      </div>
    
  )
}
  
