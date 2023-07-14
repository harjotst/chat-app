import { useState } from 'react';

export const SignUpLogIn = () => {
  const [signUp, setSignUp] = useState(true);

  return (
    <div className='w-96 flex flex-col items-center justify-center m-4 p-4 border border-gray-300 rounded-lg shadow-xl bg-white'>
      <h1 className='text-4xl tracking-widest mb-2'>
        Chat<span className='text-blue-300'>Link</span>
      </h1>
      <h3 className='font-bold text-gray-500 text-center mb-2'>
        ChatLink - Breaking Language Barriers, Building Connections.
      </h3>
      <div class='w-full border-t border-gray-300 mb-4'></div>
      {signUp && (
        <input
          class='w-full px-3 py-2 border border-gray-200 focus:border-gray-300 focus:outline-none focus:shadow-sm rounded-md bg-gray-100 placeholder-gray-400 text-black mb-1'
          type='text'
          placeholder='Your Name'
        />
      )}
      <input
        class='w-full px-3 py-2 border border-gray-200 focus:border-gray-300 focus:outline-none focus:shadow-sm rounded-md bg-gray-100 placeholder-gray-400 text-black mb-1'
        type='email'
        placeholder='Email'
      />
      <input
        class='w-full px-3 py-2 border border-gray-200 focus:border-gray-300 focus:outline-none focus:shadow-sm rounded-md bg-gray-100 placeholder-gray-400 text-black mb-3'
        type='password'
        placeholder='Password'
      />
      <button class='w-full px-3 py-2 border border-blue-500 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 hover:border-blue-600 transition-colors duration-200 mb-1'>
        {signUp ? 'Sign Up' : 'Log In'}
      </button>
      <span class='text-gray-400'>or</span>
      <div>
        <span>{signUp ? 'Have an account?' : 'Need to register?'} </span>
        {signUp ? (
          <button className='text-blue-500' onClick={() => setSignUp(false)}>
            Log In
          </button>
        ) : (
          <button className='text-blue-500' onClick={() => setSignUp(true)}>
            Sign Up
          </button>
        )}
      </div>
    </div>
  );
};
