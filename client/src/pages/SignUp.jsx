import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (password) => {
    // Example validation: Password must be at least 8 characters long, contain a number, and a special character
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!validatePassword(value)) {
      setError(
        'Password must be at least 8 characters long and include at least one number and one special character.'
      );
    } else {
      setError('');
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
        />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <p className='text-red-600 text-sm'>{error}</p>}
        <button
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          disabled={!!error || !password} // Disable button if there's an error or password is empty
        >
          Sign Up
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  );
}
