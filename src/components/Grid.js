import './Grid.css';

const Grid = props => {
  return (
    <table className='user-list'>
      <thead>
        <tr>
          <th>Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {props.users.map((user, idx) => {
          return (
            <tr key={idx}>
              <td>{user.id}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <button type='button' className='btn-warning' onClick={() => props.onEdit(user.id)}>
                  Edit
                </button>
              </td>
              <td>
                <button type='button' className='btn-danger' onClick={() => props.onDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Grid;