import React, { useState } from 'react';
import './Login.css';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post('/auth/login', formData);

    localStorage.setItem('token', res.data.token);

    navigate('/dashboard');
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type='email'
          name='email'
          placeholder='Email'
          onChange={handleChange}
        />

        <input
          type='password'
          name='password'
          placeholder='Password'
          onChange={handleChange}
        />

        <button type='submit'>Login</button>

        <p>
          Don't have an account? <Link to='/register'>Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;