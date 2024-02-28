import React, { useState } from 'react';
import styles from './CreateTask.module.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Delete from '../../../images/Delete.png';

function CreateTask({ onClose }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [checklistItems, setChecklistItems] = useState([{ text: '', checked: false }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showChecklist, setShowChecklist] = useState(true);
  const [isPrioritySelected, setIsPrioritySelected] = useState(false);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleAddChecklistItem = () => {
    setChecklistItems([...checklistItems, { text: '', checked: false }]);
  };

  const handleDeleteChecklistItem = (index) => {
    const updatedChecklist = [...checklistItems];
    updatedChecklist.splice(index, 1);
    setChecklistItems(updatedChecklist);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    toggleCalendar();
  };

  const handlePrioritySelection = (selectedPriority) => {
    setPriority(selectedPriority);
    setIsPrioritySelected(true);
  };

  const handleSubmit = async () => {
    if (!title || !isPrioritySelected || checklistItems.length === 0) {
      alert('Please fill out all required fields.');
      return;
    }

    const authToken = localStorage.getItem('authToken');
  
    try {
      const response = await axios.post(
        'https://promanageapi.onrender.com/task/create',
        { title, priority, checklistItems, dueDate: selectedDate},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data); 
      onClose();
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      
    }
  };

  return (
    <div className={styles.taskDetails}>
      <div className={styles.taskHeader}>
        <h3>Title</h3>
        <input
          type="text"
          className={styles.titleInput}
          placeholder="Enter your task"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className={styles.prioritySelector}>
        <span>Select Priority</span>
        <div>
          <button
            className={`${styles.priorityButton} ${styles.highPriority} ${priority === 'high' && styles.selected}`}
            onClick={() => handlePrioritySelection('high')}
          >
            <span className={styles.priorityDot}></span>
            High Priority
          </button>
            
          <button
            className={`${styles.priorityButton} ${styles.mediumPriority} ${priority === 'medium' && styles.selected}`}
            onClick={() => handlePrioritySelection('medium')}
          >
            <span className={styles.priorityDot}></span>
            Moderate Priority
          </button>
                
          <button
            className={`${styles.priorityButton} ${styles.lowPriority} ${priority === 'low' && styles.selected}`}
            onClick={() => handlePrioritySelection('low')}
          >
            <span className={styles.priorityDot}></span>
            Low Priority
          </button>
        </div>
      </div>

      <div className={styles.taskBody}>
        <div className={styles.checklistContainer}>
          {showChecklist && (
            <div className={styles.checklist}>
              <h3 className={styles.checklistHeader}>
                Checklist<span className={styles.red}>*</span>
                ({checklistItems.filter(item => item.checked).length}/{checklistItems.length})
              </h3>
              <div className={styles.checklistItemsContainer}>
                <ul>
                  {checklistItems.map((item, index) => (
                    <li key={index}>
                      <div className={styles.checklistItem}>
                        <input
                          type="checkbox"
                          id={`item${index + 1}`}
                          checked={item.checked}
                          onChange={() => {
                            const updatedChecklist = [...checklistItems];
                            updatedChecklist[index] = { ...updatedChecklist[index], checked: !updatedChecklist[index].checked };
                            setChecklistItems(updatedChecklist);
                          }}
                        />
                        <label htmlFor={`item${index + 1}`}>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => {
                              const updatedChecklist = [...checklistItems];
                              updatedChecklist[index] = { ...updatedChecklist[index], text: e.target.value };
                              setChecklistItems(updatedChecklist);
                            }}
                          />
                        </label>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteChecklistItem(index)}>
                          <img src={Delete} alt="Delete" className={styles.deleteImg} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <button className={styles.addBtn} onClick={handleAddChecklistItem}>+ Add New</button>
            </div>
          )}
        </div>

        <div className={styles.taskDueDate}>
          <div className={styles.dueDatePicker}>
            <button className={styles.calendarButton} onClick={toggleCalendar}>
              {selectedDate ? selectedDate.toLocaleDateString() : 'Select Due Date'}
            </button>
            {showCalendar && (
              <div className={styles.calendarContainer}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                />
              </div>
            )}
          </div>

          <div className={styles.Buttons}>
            <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button className={styles.saveButton} onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
