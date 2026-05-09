import React, { useState } from 'react';
import './Register.css';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
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

    await API.post('/auth/register', formData);

    navigate('/');
  };

  return (
    <div className='register-container'>
      <form className='register-form' onSubmit={handleSubmit}>
        <div className='auth-header'>
          <h2>Create account</h2>
          <p>Start tracking your budget with clarity.</p>
        </div>

        <div className='auth-fields'>
          <label className='input-label' htmlFor='register-name'>
            Name
          </label>
          <input
            id='register-name'
            type='text'
            name='name'
            placeholder='Full name'
            onChange={handleChange}
          />

          <label className='input-label' htmlFor='register-email'>
            Email
          </label>
          <input
            id='register-email'
            type='email'
            name='email'
            placeholder='name@company.com'
            onChange={handleChange}
          />

          <label className='input-label' htmlFor='register-password'>
            Password
          </label>
          <input
            id='register-password'
            type='password'
            name='password'
            placeholder='Create a password'
            onChange={handleChange}
          />
        </div>

        <div className='auth-actions'>
          <button type='submit'>Register</button>

          <p>
            Already have an account? <Link to='/'>Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;