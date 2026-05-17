import React, { useState } from 'react';
import './Register.css';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import AuthIllustration from '../components/AuthIllustration';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
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
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      await API.post('/auth/register', payload);

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className='auth-shell auth-shell--register'>
      <div className='auth-layout'>
        <section className='auth-hero'>
          <span className='auth-hero-badge'>Create your space</span>
          <h1>Design a calmer way to manage money.</h1>
          <p>
            Build budgets, log expenses, and see your progress with a
            beautifully organized finance hub.
          </p>

          <div className='auth-hero-art'>
            <AuthIllustration />
          </div>

          <div className='auth-hero-notes'>
            <div className='auth-note'>
              <span className='auth-note-title'>Realtime flow</span>
              <span className='auth-note-value'>Instant budget updates</span>
            </div>
            <div className='auth-note'>
              <span className='auth-note-title'>Guided setup</span>
              <span className='auth-note-value'>Smart categories ready</span>
            </div>
          </div>
        </section>

        <form className='auth-card' onSubmit={handleSubmit}>
          <div className='auth-card-header'>
            <p className='auth-card-kicker'>Welcome to Expense Tracker</p>
            <h2>Create your account</h2>
            <p className='auth-card-hint'>Start tracking with clarity.</p>
          </div>

          {error && <div className='auth-error'>{error}</div>}

          <div className='auth-fields'>
            <label className='auth-label' htmlFor='register-name'>
              Name
            </label>
            <div className='auth-input'>
              <span className='auth-input-icon' aria-hidden='true'>
                N
              </span>
              <input
                id='register-name'
                type='text'
                name='name'
                placeholder='Full name'
                value={formData.name}
                onChange={handleChange}
                autoComplete='name'
                required
              />
            </div>

            <label className='auth-label' htmlFor='register-email'>
              Email
            </label>
            <div className='auth-input'>
              <span className='auth-input-icon' aria-hidden='true'>
                @
              </span>
              <input
                id='register-email'
                type='email'
                name='email'
                placeholder='name@company.com'
                value={formData.email}
                onChange={handleChange}
                autoComplete='email'
                required
              />
            </div>

            <label className='auth-label' htmlFor='register-password'>
              Password
            </label>
            <div className='auth-input'>
              <span className='auth-input-icon' aria-hidden='true'>
                *
              </span>
              <input
                id='register-password'
                type='password'
                name='password'
                placeholder='Create a password'
                value={formData.password}
                onChange={handleChange}
                autoComplete='new-password'
                required
              />
            </div>
          </div>

          <div className='auth-inline'>
            <label className='auth-check'>
              <input type='checkbox' />
              I agree to the terms of service
            </label>
          </div>

          <button type='submit' className='auth-submit'>
            Create account
          </button>

          <p className='auth-footer'>
            Already have an account? <Link to='/'>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;