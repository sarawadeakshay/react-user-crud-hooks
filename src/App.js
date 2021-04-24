import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import UserList from './components/UserList';
import CreateUser from './components/CreateUser';

function App() {
  return (
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
  );
}

export default App;
