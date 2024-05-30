import { useEffect, useState } from "react";
import NavBar from "../Bars/NavBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = ({ onApproveToBrowse, premissionRef }) => {
  const [logOut, setLogOut] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    userName: "",
    password: "",
    nickName: "",
    picture: ""
  });
  const navigate = useNavigate();

  const getUser = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/users/${userI.userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setUser(result.user);
        setUserData({
          userName: result.user.userName,
          password: result.user.password,
          nickName: result.user.nickName,
          picture:  result.user.picture,
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getUser();
  }, []);

  const updateUser = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      newData: {
        ...userData,
      },
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/users/getUser?id=${user._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Profile Updated");
      })
      .catch((error) => console.error(error));
  };

  const deleteUser = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${user.token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: user.id,
      token: user.token,
    });

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`http://localhost:5000/api/users/${user.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("User deleted");
        navigate("/");
      })
      .catch((error) => console.error(error));
  };

  const handleLogOut = () => {
    setLogOut(true);
    onApproveToBrowse(false);
    premissionRef.current = false;
    navigate("/");
    // Redirect or perform additional cleanup
  };

  return (
    <div>
      <NavBar firstHandleClick={handleLogOut} />

      <div style={{ margin: "10px auto" }} className="login-container">
        <h2>Update User</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              value={userData.userName}
              onChange={(e) =>
                setUserData({ ...userData, userName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Password</label>
            <input
              type="text"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">NickName:</label>
            <input
              type="text"
              value={userData.nickName}
              onChange={(e) =>
                setUserData({ ...userData, nickName: e.target.value })
              }
            />
          </div>
          <button className="login_button" onClick={updateUser}>
            Update User
          </button>
        </form>
        <button
          style={{ backgroundColor: "red" }}
          className="register_button"
          onClick={deleteUser}
        >
          Delete user
        </button>
      </div>
    </div>
  );
};

export default UserProfile;