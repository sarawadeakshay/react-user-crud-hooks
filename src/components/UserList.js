import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from './Grid';
import './UserList.css';
import { API_URL, ERROR_MSG, LOADING_MSG, SEARCH_TEXT, SUCCESS_DELETE_USER, ERROR_DELETE_USER } from '../constants';
import UserConext from '../store/user-context';

const UserList = () => {
  const [isError, setIsError] = useState(false);
  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const [isDeleteAction, setIsDeleteAction] = useState(false);
  const history = useHistory();
  
  const ctx = useContext(UserConext);

  useEffect(() => {
    ctx.loadingHandler(true);
    setIsDeleteAction(false);
    fetch(API_URL)
      .then(res => res.json())
      .then(res => {
        setTimeout(() => {
          ctx.usersHandler(res.data);
          ctx.localUsersHandler(res.data);
          ctx.loadingHandler(false);
        }, 500);
      })
      .catch(() => setIsError(true))
      // .finally(() => ctx.loadingHandler(false));
  }, []);

  const onAddUser = () => {
    history.push('/users/create');
  };

  const onEdit = id => {
    history.push(`/users/edit/${id}`);
  };

  const onDelete = id => {
    setIsDeleteAction(true);
    ctx.loadingHandler(true);
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setIsUserDeleted(true);
        }
      })
      .catch(() => {
        setIsUserDeleted(false);
      })
      .finally(() => ctx.loadingHandler(false));
  };

  const onSearch = str => {
    ctx.searchHandler(str);
    ctx.loadingHandler(true);
    ctx.users = [...ctx.localUsersData];
    // Using timeout To simulate API call
    setTimeout(() => {
      const filteredUsers = ctx.users.filter(user => {
        return user.first_name.includes(str) ||
          user.last_name.includes(str) ||
          user.email.includes(str)
        });
        ctx.loadingHandler(false);
        ctx.usersHandler(filteredUsers);
    }, 500);
  };

  return (
    <div className='main-div'>
      <h1>Users List</h1>
      <div>
        <input
          name='searchStr'
          className='search'
          placeholder={SEARCH_TEXT}
          onChange={(e) => onSearch(e.target.value)}
          value={ctx.searchStr}
        />
      </div>

      <button className="btn-primary btn-lg" onClick={onAddUser}>Add User</button>
      { isDeleteAction ? (isUserDeleted ? <div className='success-msg loader'>{SUCCESS_DELETE_USER}</div> : <div className='err-msg loader'>{ERROR_DELETE_USER}</div>) : '' }
      { isError ? <div className='err-msg loader'>{ERROR_MSG}</div> : '' }
      { ctx.isLoading ? <div className='loader'>{LOADING_MSG}</div> : ''}
      { ctx.users.length ?
        <div className='grid-wrapper'>
          <Grid users={ctx.users} onEdit={onEdit} onDelete={onDelete}></Grid>
        </div> :
        <div className='loader'>No records found!</div>}
    </div>
  );
};

export default UserList;