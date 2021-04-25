import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import './CreateUser.css';
import { API_URL, ERROR_CREATE_USER, LOADING_MSG, SAVING_DATA_MSG, SUCCESS_CREATE_USER } from '../constants';
import UserConext from "../store/user-context";

const CreateUser = props => {
  const { userId } = useParams();
  const defaultUserState = { first_name: '', last_name: '', email: '' };
  const [user, setUser] = useState(defaultUserState);
  const [userCreated, setUserCreated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const history = useHistory();
  const ctx = useContext(UserConext);

  useEffect(() => {
    if (userId) {
      ctx.loadingHandler(true);
      fetch(`${API_URL}/${userId}`)
      .then(res => res.json())
      .then(res => setUser(res.data))
      // .catch(() => setIsError(true))
      .finally(() => ctx.loadingHandler(false));
    }
  }, []);

  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    ctx.loadingHandler(true);
    setFormSubmitted(true);
    if (userId) {
      updateUser();
    } else {
      createUser();
    }
  };

  // POST User
  const createUser = () => {
    const promise = fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(user)
    });
    handleUserPromise(promise);
  };

  // PUT User
  const updateUser = () => {
    const promise = fetch(`${API_URL}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(user)
    });
    handleUserPromise(promise);
  };

  // Handle success/error cases for POST/PUT calls
  const handleUserPromise = promise => {
    promise
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          setUserCreated(false);
          throw new Error(ERROR_CREATE_USER);
        }
      })
      .then(res => {
        setUserCreated(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setUser(defaultUserState);
        }, 3000)
      })
      .catch(err => {
        setUserCreated(false);
      })
      .finally(() => ctx.loadingHandler(false));
  }
  
  const onGoBack = () => {
    history.push('/users');
  };

  return (
    <div className='main-div'>
      <h1>{userId ? 'Edit' : 'Add'} User</h1>
      { ctx.isLoading ? ( userId ? LOADING_MSG : SAVING_DATA_MSG) : ''}
      {
        formSubmitted ?
          (userCreated ?
            <div className='success-msg'>{user.email} {' ' + SUCCESS_CREATE_USER}</div> :
            <div className='err-msg'>{ERROR_CREATE_USER}</div>
          ) :
          ''
      }
      <form onSubmit={onSubmit}>
        <div className='form-field'>
          <label htmlFor='first_name'>First Name:</label>
          <div className='input-field'>
            <input 
              name='first_name'
              id='first_name'
              placeholder='Enter First Name'
              value={user.first_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className='form-field'>
          <label htmlFor='last_name'>Last Name:</label>
          <div className='input-field'>
            <input
              name='last_name'
              id='last_name'
              placeholder='Enter Last Name'
              value={user.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className='form-field'>
          <label htmlFor='email'>Email:</label>
          <div className='input-field'>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Enter Email'
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className='form-field btn-wrapper'>
          <button type='button' className='btn btn-lg btn-cancel' onClick={onGoBack}>Go Back</button>
          <button type='submit' className='btn btn-lg btn-primary'>Submit</button>
        </div>

      </form>
    </div>
  );
};

export default CreateUser;
