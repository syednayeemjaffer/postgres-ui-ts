import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface usersInt {
  id: number | null;
  firstname: string;
  lastname: string;
  email: string;
  ph: string;
  password: string;
  profile: File | null;
}

const Users = () => {
  const [users, setUsers] = useState<usersInt[]>();
  const [btnNo, setBtnNo] = useState<number>(1);
  const [totalbox, setTotalbox] = useState<number>(0);
  const limit = 3;
  const navigate = useNavigate();
  let total: number[] = [];

  const fetch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:2000/api/users?page=${btnNo}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(res.data.users);
      setTotalbox(Math.ceil(res.data.totalUsers / limit));
    } catch (err: any) {
      console.log(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetch();
  }, [btnNo]);

  for (let i = 1; i <= totalbox; i++) total.push(i);

  return (
    <div className="users-container">
      <h1 className="users-title">Users</h1>
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.ph}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/update/${user.id}`,{state : user})}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {total.map((num) => (
            <button
              key={num}
              className="page-btn"
              onClick={() => setBtnNo(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
