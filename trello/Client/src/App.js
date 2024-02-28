import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './Components/LoginSignup/Signup';
import Login from './Components/LoginSignup/login';
import Dashboard from './Components/Dashboard/Dashboard';
import Analytics from './Components/Analytics/Analytics';
import Setting from './Components/Setting/Setting';
import TaskContent from './Components/TaskContent/TaskContent';
import './App.css';

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <div>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/login" element={<Login setUserId={setUserId} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics/>} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/task/tasks/:taskId" element={<TaskContent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
