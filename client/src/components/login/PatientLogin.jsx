// src/components/PatientLogin.js
import React, { useContext, useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

import { UserContext } from '../../App';

const PatientLogin = () => {
  const [user, setUser] = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const Navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    try{
        const response = await axios.post(`http://localhost:3002/api/patient/login`, {
          name: username,
          password: password
        });
        if(!response.data.exists){
            alert("Bu isimde bir kullanıcı yok!");
        }
        else if(!response.data.login){
          alert("Şifre yanlış!");
        }
        else{
          setUser(response.data.userID);
          localStorage.setItem("userID", response.data.userID);
          localStorage.setItem("userName", username);
          Navigate(`/patientDashboard/${username}`);
        }
    }catch(err){
        console.log(err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h3>Hasta Girişi:</h3>
      <div>
        <label htmlFor="username">İsim:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          autoComplete='off'
          required
        />
      </div>
      <div>
        <label htmlFor="password">Şifre:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoComplete='off'
          required
        />
      </div>
      <button type="submit" style={styles.button} className='btn'>Giriş yap</button>
      <Link to={"/patientForm"} style={styles.button} className='btn'>Yeni Hasta Oluştur</Link>
      
    </form>
  );
};

const styles = {
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #333',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default PatientLogin;
