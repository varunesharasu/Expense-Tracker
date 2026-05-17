import React from 'react';

function AuthIllustration() {
  return (
    <svg
      className='auth-hero-svg'
      viewBox='0 0 480 360'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <linearGradient id='authCardGradient' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#ffffff' />
          <stop offset='100%' stopColor='#f3e9f6' />
        </linearGradient>
        <linearGradient id='authPhoneGradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#462C7D' />
          <stop offset='100%' stopColor='#831C91' />
        </linearGradient>
        <linearGradient id='authAccentGradient' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#D552A3' />
          <stop offset='100%' stopColor='#FF70BF' />
        </linearGradient>
      </defs>

      <rect x='28' y='24' width='424' height='304' rx='40' fill='#f5e9f7' />
      <circle cx='92' cy='94' r='44' fill='url(#authAccentGradient)' opacity='0.85' />
      <circle cx='380' cy='86' r='36' fill='#e7dbf1' />
      <circle cx='418' cy='126' r='24' fill='#fbd1ea' />

      <rect x='150' y='52' width='180' height='256' rx='28' fill='url(#authPhoneGradient)' />
      <rect x='165' y='70' width='150' height='220' rx='22' fill='url(#authCardGradient)' />
      <circle cx='240' cy='88' r='8' fill='#462C7D' opacity='0.6' />

      <rect x='182' y='120' width='116' height='20' rx='10' fill='#ffffff' />
      <rect x='182' y='150' width='116' height='16' rx='8' fill='#f3e6f6' />
      <rect x='182' y='176' width='92' height='16' rx='8' fill='#f3e6f6' />
      <rect x='182' y='206' width='116' height='34' rx='12' fill='#f8d9f1' />

      <circle cx='240' cy='210' r='14' fill='#D552A3' opacity='0.7' />

      <rect x='60' y='206' width='86' height='96' rx='18' fill='#ffffff' stroke='#ead6ef' />
      <circle cx='103' cy='240' r='20' fill='#831C91' opacity='0.2' />
      <rect x='78' y='266' width='50' height='12' rx='6' fill='#ead6ef' />

      <g opacity='0.9'>
        <circle cx='92' cy='94' r='22' fill='#ffffff' />
        <rect x='86' y='90' width='12' height='16' rx='4' fill='#D552A3' />
        <rect x='78' y='102' width='28' height='18' rx='8' fill='#FF70BF' />
      </g>

      <path
        d='M364 112h52M352 132h74M360 152h56'
        stroke='#d8c3e8'
        strokeWidth='6'
        strokeLinecap='round'
      />
    </svg>
  );
}

export default AuthIllustration;
