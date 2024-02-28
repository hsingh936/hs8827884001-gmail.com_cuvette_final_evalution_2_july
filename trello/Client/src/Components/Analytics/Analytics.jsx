import React, { useState, useEffect } from 'react';
import styles from './Analytics.module.css';
import Sidebar from '../Sidebar/Sidebar';

export default function Analytics() {
  const [backlogCount, setBacklogCount] = useState(0);
  const [todoCount, setTodoCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [lowPriorityCount, setLowPriorityCount] = useState(0);
  const [mediumPriorityCount, setMediumPriorityCount] = useState(0);
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const [dueDateCount, setDueDateCount] = useState(0);



  const fetchDetails = async () => {
    try {
      const response = await fetch('http://localhost:5000/task/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        countTasks(data);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const countTasks = (data) => {
    let backlog = 0;
    let todo = 0;
    let progress = 0;
    let done = 0;
    let lowPriority = 0;
    let mediumPriority = 0;
    let highPriority = 0;
    let dueDate = 0;

    data.forEach(task => {
      switch (task.status) {
        case 'backlog':
          backlog++;
          break;
        case 'to do':
          todo++;
          break;
        case 'progress':
          progress++;
          break;
        case 'done':
          done++;
          break;
        default:
          break;
      }

      switch (task.priority) {
        case 'low':
          lowPriority++;
          break;
        case 'medium':
          mediumPriority++;
          break;
        case 'high':
          highPriority++;
          break;
        default:
          break;
      }

      if (task.dueDate) {
        dueDate++;
      }
    });

    setBacklogCount(backlog);
    setTodoCount(todo);
    setProgressCount(progress);
    setDoneCount(done);
    setLowPriorityCount(lowPriority);
    setMediumPriorityCount(mediumPriority);
    setHighPriorityCount(highPriority);
    setDueDateCount(dueDate);
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.leftside}>
        <Sidebar />
      </div>

      <div className={styles.rightside}>
        <h3 className={styles.headerAnal}>Analytics</h3>
        <div className={styles.analContent}>
          <div className={styles.analLeft}>
            <div className={styles.analWrapper}>
              <span className={styles.dot}></span>
              <span className={styles.dotText}>Backlog Tasks</span>
              <span className={styles.dotbackValue}>{backlogCount}</span>
            </div>

            <div className={styles.analWrapper}>
              <span className={styles.dot}></span>
              <span className={styles.dotText}>To-Do Tasks</span>
              <span className={styles.dottodoValue}>{todoCount}</span>
            </div>

            <div className={styles.analWrapper}>
              <span className={styles.dot}></span>
              <span className={styles.dotText}>In-Progress Tasks</span>
              <span className={styles.dotprogressValue}>{progressCount}</span>
            </div>

            <div className={styles.analWrapper}>
              <span className={styles.dot}></span>
              <span className={styles.dotText}>Completed Tasks</span>
              <span className={styles.dotdoneValue}>{doneCount}</span>
            </div>
          </div>

          <div className={styles.analRight}>
            <div className={styles.analWrapper}>
              <span className={styles.dot}></span>
              <span className={styles.dotText}>Low Priority</span>
              <span className={styles.dotlowValue}>{lowPriorityCount}</span>
            </div>

            <div className={styles.analWrapper}>
              <span className={styles.dot}></span>
              <span className={styles.dotText}>Moderate Priority</span>
              <span className={styles.dotmedValue}>{mediumPriorityCount}</span>
            </div>

            <div className={styles.analWrapper}>
              <span className={styles.dot}></span>
              <span className={styles.dotText}>High Priority</span>
              <span className={styles.dothighValue}>{highPriorityCount}</span>
            </div>

            <div className={styles.analWrapper}>
              <span className={styles.dot}></span>
              <span className={styles.dotText}>Due Date Tasks</span>
              <span className={styles.dotdueValue}>{dueDateCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
