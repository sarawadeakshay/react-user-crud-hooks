import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from './Grid';
import './UserList.css';
import { API_URL, ERROR_MSG, LOADING_MSG, SEARCH_TEXT, SUCCESS_DELETE_USER, ERROR_DELETE_USER } from '../constants';

const UserList = () => {
  let [users, setUsers] = useState([]);
  // localUsersData is used to keep a copy of the original users list fetched from the API
  // which is required to filter the data locally on search
  const [localUsersData, setLocalUsersData]  = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const [isDeleteAction, setIsDeleteAction] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    setIsDeleteAction(false);
    fetch(API_URL)
      .then(res => res.json())
      .then(res => {
        setUsers(res.data);
        setLocalUsersData(res.data);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const onAddUser = () => {
    history.push('/users/create');
  };

  const onEdit = id => {
    history.push(`/users/edit/${id}`);
  };

  const onDelete = id => {
    setIsDeleteAction(true);
    setIsLoading(true);
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setIsUserDeleted(true);
        }
      })
      .catch(() => {
        setIsUserDeleted(false);
      })
      .finally(() => setIsLoading(false));
  };

  const onSearch = str => {
    setSearchStr(str);
    setIsLoading(true);
    users = [...localUsersData];
    const filteredUsers = users.filter(user => {
      return user.first_name.includes(str) ||
        user.last_name.includes(str) ||
        user.email.includes(str)
    });
    setIsLoading(false);
    setUsers(filteredUsers);
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
          value={searchStr}
        />
      </div>

      <button className="btn-primary btn-lg" onClick={onAddUser}>Add User</button>
      { isDeleteAction ? (isUserDeleted ? <div className='success-msg loader'>{SUCCESS_DELETE_USER}</div> : <div className='err-msg loader'>{ERROR_DELETE_USER}</div>) : '' }
      { isError ? <div className='err-msg loader'>{ERROR_MSG}</div> : '' }
      { isLoading ? <div className='loader'>{LOADING_MSG}</div> : ''}
      { users.length ?
        <div className='grid-wrapper'>
          <Grid users={users} onEdit={onEdit} onDelete={onDelete}></Grid>
        </div> :
        <div className='loader'>No records found!</div>}
    </div>
  );
};

export default UserList;