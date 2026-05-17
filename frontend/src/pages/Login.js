import React, { useState } from 'react';
import './Login.css';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import AuthIllustration from '../components/AuthIllustration';

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
    <div className='auth-shell auth-shell--login'>
      <div className='auth-layout'>
        <section className='auth-hero'>
          <span className='auth-hero-badge'>Secure access</span>
          <h1>Welcome to your finance studio.</h1>
          <p>
            Track spending, plan budgets, and keep every transaction in view with a
            clean, focused workspace.
          </p>

          <div className='auth-hero-art'>
            <AuthIllustration />
          </div>

          <div className='auth-hero-notes'>
            <div className='auth-note'>
              <span className='auth-note-title'>Daily snapshots</span>
              <span className='auth-note-value'>Smart spend summaries</span>
            </div>
            <div className='auth-note'>
              <span className='auth-note-title'>Protected data</span>
              <span className='auth-note-value'>Encrypted activity feed</span>
            </div>
          </div>
        </section>

        <form className='auth-card' onSubmit={handleSubmit}>
          <div className='auth-card-header'>
            <p className='auth-card-kicker'>Welcome to Expense Tracker</p>
            <h2>Sign in to continue</h2>
            <p className='auth-card-hint'>Pick up where you left off.</p>
          </div>

          {error && <div className='auth-error'>{error}</div>}

          <div className='auth-fields'>
            <label className='auth-label' htmlFor='login-email'>
              Email
            </label>
            <div className='auth-input'>
              <span className='auth-input-icon' aria-hidden='true'>
                @
              </span>
              <input
                id='login-email'
                type='email'
                name='email'
                placeholder='name@company.com'
                value={formData.email}
                onChange={handleChange}
                autoComplete='email'
                required
              />
            </div>

            <label className='auth-label' htmlFor='login-password'>
              Password
            </label>
            <div className='auth-input'>
              <span className='auth-input-icon' aria-hidden='true'>
                *
              </span>
              <input
                id='login-password'
                type='password'
                name='password'
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                autoComplete='current-password'
                required
              />
            </div>
          </div>

          <div className='auth-inline'>
            <label className='auth-check'>
              <input type='checkbox' />
              Remember me
            </label>
            <button type='button' className='auth-text-button'>
              Forgot password?
            </button>
          </div>

          <button type='submit' className='auth-submit'>
            Login
          </button>

          <p className='auth-footer'>
            Don't have an account? <Link to='/register'>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;