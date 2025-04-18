import React, { useEffect, useState } from 'react';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/users')
            .then(res => res.json())
            .then(data => setUsers(data.users));
    }, []);

    return (
        <div>
            <h2>Users</h2>
            {users.map(user => <div key={user.id}>{user.name}</div>)}
        </div>
    );
};

export default Users;
