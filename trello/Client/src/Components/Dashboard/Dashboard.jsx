import React, { useState, useEffect, useRef } from 'react';
import styles from './Dashboard.module.css';
import Sidebar from '../Sidebar/Sidebar';
import CreateTask from './CreateTask/CreateTask';
import Task from './Task/Task';
import shrink from '../../images/shring.png';
import add from '../../images/add.png';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState('this-week');

  const backlogSectionRef = useRef(null);
  const todoSectionRef = useRef(null);
  const progressSectionRef = useRef(null);
  const doneSectionRef = useRef(null);

  useEffect(() => {
    fetchTasks();
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await fetch('https://promanageapi.onrender.com/auth/username', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsername(data.name);
      } else {
        console.error('Failed to fetch username');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://promanageapi.onrender.com/task/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleOpenModal = () => {
    setIsCreateTaskModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsCreateTaskModalOpen(false);
    await fetchTasks();
  };

  const handleStatusButtonClick = async (taskId, newStatus) => {
    try {
      const response = await fetch(`https://promanageapi.onrender.com/task/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const updatedTasks = tasks.map(task => {
          if (task._id === taskId) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        setTasks(updatedTasks);
      } else {
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteButtonClick = async (taskId) => {
    try {
      const response = await fetch(`https://promanageapi.onrender.com/task/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });
      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        console.log('Task deleted successfully');
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filterTasksByCreatedAt = (option) => {
    const currentDate = new Date();
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      switch (option) {
        case 'this-week':
          const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
          return taskDate >= startOfWeek && taskDate <= currentDate;
        case 'this-month':
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          return taskDate >= startOfMonth && taskDate <= endOfMonth;
        case 'today':
          const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
          const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
          return taskDate >= startOfDay && taskDate < endOfDay;
        default:
          return true;
      }
    });
    return filteredTasks;
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
  };

  const renderTasksBySection = (sectionRef, status) => {
    const filteredTasks = filterTasksByCreatedAt(filterOption);
    const tasksToRender = filteredTasks.filter(task => task.status === status);
    return (
      <div className={styles.taskContainer} style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(141, 170, 185, 0.8)'}}>
        {tasksToRender.map(task => (
          <Task key={task._id} task={task} onStatusButtonClick={(newStatus) => handleStatusButtonClick(task._id, newStatus)} onDelete={handleDeleteButtonClick} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.leftside}>
        <Sidebar />
      </div>

      <div className={styles.SubContainer}>
        <div className={styles.NameDate}>
          <h3 className={styles.Username}>Welcome, {username}</h3>
          <div className={styles.currentDate}>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className={styles.headerName}>
          <h2>Board</h2>
          <div className={styles.filterDropdown}>
          <select className={styles.filterDropdownOptions} value={filterOption} onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="today">Today</option>
          </select>
        </div>
        </div>

        <div className={styles.sections}>
          <div className={styles.backlogSection} ref={backlogSectionRef}>
            <div className={styles.headerContainer}>
              <h4 className={styles.header1}>Backlog</h4>
            </div>
            <div className={styles.imageContainer}>
              <button className={styles.btn1}>
                <img src={shrink} alt="" style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            {renderTasksBySection(backlogSectionRef, 'backlog')}
          </div>

          <div className={styles.todoSection} ref={todoSectionRef}>
            <div className={styles.headerContainer}>
              <h4 className={styles.header2}>To do</h4>
            </div>
            {renderTasksBySection(todoSectionRef, 'to do')}
            <div className={styles.imageContainer}>
              <button className={styles.addBtn} onClick={handleOpenModal}>
                <img src={add} alt="" style={{ width: '14px', height: '14px' }} />
              </button>
              <button className={styles.btn2} style={{ width: '18px', height: '18px' }}>
                <img src={shrink} alt="" />
              </button>
            </div>
          </div>

          <div className={styles.progressSection} ref={progressSectionRef}>
            <div className={styles.headerContainer}>
              <h4 className={styles.header3}>In Progress</h4>
            </div>
            {renderTasksBySection(progressSectionRef, 'progress')}
            <div className={styles.imageContainer}>
              <button className={styles.btn3} style={{ width: '18px', height: '18px' }}>
                <img src={shrink} alt="" />
              </button>
            </div>
          </div>

          <div className={styles.doneSection} ref={doneSectionRef}>
            <div className={styles.headerContainer}>
              <h4 className={styles.header4}>Done</h4>
            </div>
            {renderTasksBySection(doneSectionRef, 'done')}
            <div className={styles.imageContainer}>
              <button className={styles.btn4} style={{ width: '18px', height: '18px' }}>
                <img src={shrink} alt="" />
              </button>
            </div>
          </div>
          {isCreateTaskModalOpen && (
            <div className={styles.TaskmodalBackground}>
              <div className={styles.TaskmodalContainer}>
                <CreateTask onClose={handleCloseModal} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
