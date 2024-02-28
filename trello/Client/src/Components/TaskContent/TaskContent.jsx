import React, { useState, useEffect } from 'react';
import styles from './TaskContent.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import pro from '../../images/promanage.png';

export default function TaskContent() {
    const { taskId } = useParams();
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`https://promanageapi.onrender.com/task/tasks/${taskId}`);
                setDetails(response.data);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        fetchTask();
    }, [taskId]); 

    const getPriorityDisplay = () => {
        if (!details || !details.priority) {
            return 'Unknown Priority';
        }
        switch (details.priority) {
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
    
    const getPriorityDotClass = () => {
        if (!details || !details.priority) {
            return '';
        }
        switch (details.priority) {
            case 'high':
                return styles.priorityDotHigh;
            case 'medium':
                return styles.priorityDotMedium;
            case 'low':
                return styles.priorityDotLow;
            default:
                return ''; 
        }
    };

    return (
        <div>
            <div className={styles.proHeader}>
                <img src={pro} alt="" />
                <h4>Pro Manage</h4>
            </div>

            <div className={styles.detailsContainer}>
            <div className={styles.priority}>
                {details && (
                <>
                <span className={`${styles.deatilspriorityDot} ${getPriorityDotClass()}`}></span>
                <span className={styles.prioritylevel}>{getPriorityDisplay()}</span>
                </>
                )}
            </div>

            {details && 
                <div className={styles.detailsTitle}>{details.title}</div>}

                <div className={styles.checklistContainer}>
                    <div className={styles.deatilschecklist}>
                        {details && `Checklist (${details.checklistItems.filter(item => item.checked).length}/${details.checklistItems.length})`}
                    </div>
                    <div className={styles.detailschecklistItems}>
                        {/* Move checklist items inside this div */}
                        {details && details.checklistItems.map((item, index) => (
                            <div key={index} className={styles.detailschecklistItem}>
                                <input type="checkbox" checked={item.checked} readOnly />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.detailsdueDate}>
                        {details && details.dueDate && (
                            <>
                                <span className={styles.detailsdueDateLabel}>Due Date</span>
                                <button className={styles.detailsdueDateBtn}>
                                    {new Date(details.dueDate).getDate()} {new Date(details.dueDate).toLocaleString('default', { month: 'short' })}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
