import React from 'react';

const UserConext = React.createContext({
  users: [],
  localUsersData: [],
  usersHandler: () => {},
  // localUsersData is used to keep a copy of the original users list fetched from the API
  // which is required to filter the data locally on search
  localUsersHandler: () => {},
  searchStr: '',
  searchHandler: () => {},
  isLoading: false,
  loadingHandler: () => {}
});

export default UserConext;