import { useState } from 'react';

import languageShortForms from '../data/languages';

import { useUser } from '../hooks/useUser';

import { loginUser, registerUser } from '../services/user';

import Popup from './PopUp';

const SignUpLogIn = () => {
  const { setUser } = useUser();

  const [signUp, setSignUp] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    language: '',
  });

  const [errors, setErrors] = useState({});

  const [touched, setTouched] = useState({});

  const [showPopUpError, setShowPopUpError] = useState(false);

  const [popUpMessage, setPopUpMessage] = useState('');

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    handleInputChange(e);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!signUp) return;

    switch (name) {
      case 'name':
        if (!value.trim()) {
          setErrors((prev) => ({ ...prev, name: 'Name is required' }));
        } else {
          setErrors((prev) => ({ ...prev, name: null }));
        }
        break;
      case 'email':
        if (!value.trim()) {
          setErrors((prev) => ({ ...prev, email: 'Email is required' }));
        } else if (!validateEmail(value)) {
          setErrors((prev) => ({ ...prev, email: 'Email is not valid' }));
        } else {
          setErrors((prev) => ({ ...prev, email: null }));
        }
        break;
      case 'password':
        if (!value) {
          setErrors((prev) => ({ ...prev, password: 'Password is required' }));
        } else if (!validatePassword(value)) {
          setErrors((prev) => ({
            ...prev,
            password:
              'Password must be at least 8 characters long with a combination of uppercase, lowercase, numbers, and special characters.',
          }));
        } else {
          setErrors((prev) => ({ ...prev, password: null }));
        }
        break;
      case 'language':
        if (!value) {
          setErrors((prev) => ({
            ...prev,
            language: 'Select a valid language',
          }));
        } else {
          setErrors((prev) => ({ ...prev, language: null }));
        }
      default:
        break;
    }
  };

  const handleSubmit = (action) => {
    let newErrors = { ...errors };

    if (action === 'signup' && (!formData.name || !touched.name)) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email || !touched.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password || !touched.password) {
      newErrors.password = 'Password is required';
    }

    if (action === 'signup' && (!formData.language || !touched.language)) {
      newErrors.name = 'Select a valid language';
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) {
      console.log('There are errors in the form.');

      return;
    }

    if (action === 'login') {
      loginUser(formData.email, formData.password)
        .then((result) => {
          setUser(result.user);
        })
        .catch((error) => {
          console.log(error.message);

          setPopUpMessage(error.message);

          setShowPopUpError(true);
        });
    } else if (action === 'signup') {
      registerUser(
        formData.name,
        formData.email,
        formData.password,
        formData.language
      )
        .then((result) => {
          setUser(result.user);
        })
        .catch((error) => {
          console.log(error.message);

          setPopUpMessage(error.message);

          setShowPopUpError(true);
        });
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const computeInputClasses = (inputName) => {
    const baseClasses = [
      'border',
      'focus:outline-none',
      'focus:shadow-sm',
      'rounded-md',
      'placeholder-gray-400',
      'text-black',
      'w-full',
      'px-3',
      'py-2',
      'transition',
      'ease-in-out',
      'duration-300',
    ];

    if (errors[inputName] && touched[inputName]) {
      baseClasses.push('border-red-400', 'focus:border-red-500', 'bg-red-100');
    } else {
      baseClasses.push(
        'border-gray-200',
        'focus:border-gray-300',
        'bg-gray-100'
      );
    }

    return baseClasses.join(' ');
  };

  const computeErrorClasses = (inputName) => {
    const baseClasses = ['text-sm', 'text-red-300', 'italic', 'px-3'];

    if (!errors[inputName] || !touched[inputName]) {
      baseClasses.push('mb-1');
    }

    return baseClasses.join(' ');
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-96 flex flex-col items-center justify-center m-4 p-4 border border-gray-300 rounded-lg shadow-xl bg-white'>
        <h1 className='text-4xl tracking-widest mb-2'>
          Chat<span className='text-blue-300'>Link</span>
        </h1>
        <h3 className='font-bold text-gray-500 text-center mb-2'>
          ChatLink - Breaking Language Barriers, Building Connections.
        </h3>
        <div className='w-full border-t border-gray-300 mb-4'></div>
        {signUp && (
          <div className='relative w-full'>
            <input
              className={computeInputClasses('name')}
              type={'text'}
              name={'name'}
              placeholder={'Your Name'}
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <div className={computeErrorClasses('name')}>
              {errors.name && touched.name && errors.name}
            </div>
          </div>
        )}
        <div className='relative w-full'>
          <input
            className={computeInputClasses('email')}
            type={'email'}
            name={'email'}
            placeholder={'Email'}
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <div className={computeErrorClasses('email')}>
            {errors.email && touched.email && errors.email}
          </div>
        </div>
        <div className='relative w-full'>
          <input
            className={computeInputClasses('password')}
            type={'password'}
            name={'password'}
            placeholder={'Password'}
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <div className={computeErrorClasses('password')}>
            {errors.password && touched.password && errors.password}
          </div>
        </div>
        {signUp && (
          <div className='relative w-full'>
            <select
              name='language'
              placeholder='Preferred Language'
              className={computeInputClasses('language')}
              onChange={handleInputChange}
              onBlur={handleBlur}
            >
              <option value='' defaultChecked>
                Preferred Language
              </option>
              {Object.entries(languageShortForms).map(([language, code]) => (
                <option key={code} value={code}>
                  {language}
                </option>
              ))}
            </select>
            <div className={computeErrorClasses('language')}>
              {errors.language && touched.language && errors.language}
            </div>
          </div>
        )}
        <button
          className='text-center font-normal w-full px-3 py-2 mt-1 border border-blue-500 rounded-md bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 transition-colors duration-200 mb-1'
          onClick={() => handleSubmit(signUp ? 'signup' : 'login')}
        >
          {signUp ? 'Sign Up' : 'Log In'}
        </button>
        <span className='text-gray-400'>or</span>
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
      <Popup show={showPopUpError} close={() => setShowPopUpError(false)}>
        <p>{popUpMessage}</p>
      </Popup>
    </div>
  );
};

export default SignUpLogIn;
