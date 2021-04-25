import { useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import UserList from './components/UserList';
import CreateUser from './components/CreateUser';
import UserConext from './store/user-context';

function App() {
  let [users, setUsers] = useState([]);
  const [localUsersData, setLocalUsersData]  = useState([]);
  const [searchStr, setSearchStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const usersHandler = data => {
    setUsers(data);
  };

  const localUsersHandler = data => {
    setLocalUsersData(data);
  };

  const searchHandler = str => {
    setSearchStr(str);
  };

  const loadingHandler = isLoading => {
    setIsLoading(isLoading);
  };

  return (
    <UserConext.Provider value={{
      users,
      localUsersData,
      usersHandler,
      localUsersHandler,
      searchStr,
      searchHandler,
      isLoading,
      loadingHandler
    }}>
      <BrowserRouter>
        <Switch>
          {/* If we don't use exact here, below paths are never matched */}
          <Route exact path='/users' component={UserList}></Route>
          <Route path='/users/create' component={CreateUser}></Route>
          <Route path='/users/edit/:userId' component={CreateUser}></Route>
          {/* any route other than above will be redirected to /users */}
          <Route path='/'><Redirect to='/users' /></Route>
        </Switch>
      </BrowserRouter>
    </UserConext.Provider>
  );
}

export default App;
