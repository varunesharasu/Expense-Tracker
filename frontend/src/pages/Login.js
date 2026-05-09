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
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const res = await API.post('/auth/login', payload);

      localStorage.setItem('token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <div className='auth-header'>
          <h2>Welcome back</h2>
          <p>Sign in to keep your spending on track.</p>
        </div>

        {error && <div className='auth-error'>{error}</div>}

        <div className='auth-fields'>
          <label className='input-label' htmlFor='login-email'>
            Email
          </label>
          <input
            id='login-email'
            type='email'
            name='email'
            placeholder='name@company.com'
            onChange={handleChange}
          />

          <label className='input-label' htmlFor='login-password'>
            Password
          </label>
          <input
            id='login-password'
            type='password'
            name='password'
            placeholder='Enter your password'
            onChange={handleChange}
          />
        </div>

        <div className='auth-actions'>
          <button type='submit'>Login</button>

          <p>
            Don't have an account? <Link to='/register'>Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;