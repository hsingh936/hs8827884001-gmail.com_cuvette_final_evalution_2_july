import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import styles from './Task.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import arrow from '../../../images/Arrow.png';
import Edit from '../Edit/Edit';

const Task = ({ task, onStatusButtonClick, onDelete }) => {
  const [checklistItems, setChecklistItems] = useState(task.checklistItems);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChecklistItems, setShowChecklistItems] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [cardHeight, setCardHeight] = useState('368px');

  const toggleCheckbox = (index) => {
    const updatedChecklistItems = [...checklistItems];
    updatedChecklistItems[index].checked = !updatedChecklistItems[index].checked;
    setChecklistItems(updatedChecklistItems);
  };

  useEffect(() => {
    updateBackendChecklist(task._id, checklistItems);
  }, [checklistItems]);

  useEffect(() => {
    setCardHeight(showChecklistItems ? '368px' : '150px');
  }, [showChecklistItems]);


  const updateBackendChecklist = async (taskId, checklistItems) => {
    try {
      const response = await fetch(`http://localhost:5000/task/tasks/${taskId}/checklist`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ checklistItems }),
      });
      if (!response.ok) {
        console.error('Failed to update checklist items in the backend');
      }
    } catch (error) {
      console.error('Error updating checklist items in the backend:', error);
    }
  };


  const handleSubmit = async (updatedTask) => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axios.put(
        `http://localhost:5000/task/tasks/${task._id}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
      
    }
  };


  const handleDeleteButtonClick = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    onDelete(task._id);
    setShowConfirmationModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const handleShare = (taskId) => {
    const quizLink = `${window.location.origin}/task/tasks/${taskId}`;

    navigator.clipboard.writeText(quizLink).then(() => {
      toast.success('Link Copied');
    });
  };

  const getPriorityDisplay = () => {
    switch (task.priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Moderate Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Unknown Priority';
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'rgba(255, 36, 115, 1)';
      case 'medium':
        return 'rgba(24, 176, 255, 1)';
      case 'low':
        return 'rgba(99, 192, 91, 1)';
      default:
        return 'black';
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStatusButtonClick = (newStatus) => {
    onStatusButtonClick(newStatus);
  };

  const handleEditButtonClick = () => {
    setShowEditModal(true); 
  };



  const isPastDue = new Date(task.dueDate) < new Date();
  const isDone = task.status === 'done';

  return (
    <div className={`${styles.Card}`} style={{ maxHeight: cardHeight }}>
      <div className={styles.taskCard}>
        <div className={styles.priority}>
          <span className={styles.priorityDot} style={{ backgroundColor: getPriorityColor(task.priority) }}></span>
          <span>{getPriorityDisplay(task.priority)}</span>

          <div className={styles.dropdown}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>...</button>
            {showDropdown && (
              <div className={styles.dropdownContent}>
                <button className={styles.dropdownEdit} onClick={handleEditButtonClick}>Edit</button>
                <button className={styles.dropdownShare} onClick={() => handleShare(task._id)}>Share</button>
                <button className={styles.dropdownDelete} onClick={() => handleDeleteButtonClick()}>Delete</button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.taskTitleContainer}>
          <div className={styles.taskTitle} title={task.title}>
            {task.title.length > 12 ? `${task.title.substring(0, 12)}...` : task.title}
          </div>
        </div>

        <div className={styles.checklist}>
          <span>Checklist</span>
          <span>({`${checklistItems.filter(item => item.checked).length}/${checklistItems.length}`})</span>
          <button className={styles.downBtn} onClick={() => setShowChecklistItems(!showChecklistItems)}>
            <img className={styles.arrowImg} src={arrow} alt="" />
          </button>
        </div>

        {showChecklistItems && (
          <div className={`${styles.checklistItemsContainer}`}>
            {checklistItems.map((item, index) => (
              <div key={index} className={styles.checklistItems}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheckbox(index)}
                  className={styles.checklistBoxes}
                />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.taskFooter}>
          {task.dueDate && (
             <button className={`${styles.dueDateButton} ${isDone ? styles.done : isPastDue ? styles.pastDue : ''}`} title={`Due Date: ${task.dueDate}`}>
              <span className={styles.month}>{new Date(task.dueDate).toLocaleString('default', { month: 'short' })}</span>
              <span className={styles.date}>{new Date(task.dueDate).getDate()}</span>
             </button>
          )}


          <div className={styles.statusButtons}>
            {task.status !== 'backlog' && (
              <button className={styles.backlogButton} onClick={() => handleStatusButtonClick('backlog')} disabled={task.status === 'backlog'}>BACKLOG</button>
            )}
            {task.status !== 'to do' && (
              <button className={styles.todoButton} onClick={() => handleStatusButtonClick('to do')} disabled={task.status === 'to do'}>TO DO</button>
            )}
            {task.status !== 'progress' && (
              <button className={styles.progressButton} onClick={() => handleStatusButtonClick('progress')} disabled={task.status === 'progress'}>PROGRESS</button>
            )}
            {task.status !== 'done' && (
              <button className={styles.doneButton} onClick={() => handleStatusButtonClick('done')} disabled={task.status === 'done'}>DONE</button>
            )}
          </div>

          {showConfirmationModal && (
          <div className={styles.ConfirmationModal}>
            <div className={styles.ConfirmationModalContent}>
              <p className={styles.ConfirmationMessage}>Are you sure you want to delete?</p>
              <div className={styles.ConfirmationModalButtons}>
                <button className={styles.ConfirmButton} onClick={handleConfirmDelete}>Yes, Delete</button>
                <button className={styles.CancelButton} onClick={handleCancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
        <div className={styles.TaskmodalBackground}>
          <div className={styles.TaskmodalContainer} >
          <Edit task={task} onClose={() => setShowEditModal(false)} onSubmit={handleSubmit} />
          </div>
        </div>
        )}
         
        </div>
      </div>
    </div>
  );
};

export default Task;