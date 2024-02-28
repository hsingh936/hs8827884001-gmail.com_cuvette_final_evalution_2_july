import React from 'react';
import styles from './ConfirmationLogoutModal.module.css';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <p className={styles.messageLogout}>{message}</p>
        <div className={styles.Btns}>
          <button className={styles.Btn_1} onClick={onConfirm}>Yes, Logout</button>
          <button className={styles.Btn_2} onClick={onCancel}>Cancle</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
