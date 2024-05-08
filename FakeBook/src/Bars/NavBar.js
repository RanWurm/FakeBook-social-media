import React from "react";
import "../css/BarsCss/NavBar.css";
import GoldenIcon from "../res/goldenFacebook.png";
import FakeBook from "../res/facebook.png";
import { Link, useNavigate } from "react-router-dom";
export default function NavBar({ firstHandleClick, darkMode, toggleDarkMode }) {
  let logoToUse = darkMode ? GoldenIcon : FakeBook;
  const navigate = useNavigate();

  return (
    <nav className={darkMode ? "dark" : ""}>
      <div className="left_col">
        <img className="fb_icon " src={logoToUse} />
        <input
          className="search-tab"
          type="text"
          placeholder="search in FakeBook"
        />
      </div>

      <div className="right_col">
        <button className="button" onClick={() => navigate("/feed")}>
          Feed
        </button>
        <button className="button" onClick={() => navigate("/add-friends")}>
          Friends
        </button>
        <button className="button" onClick={() => navigate("/user-profile")}>
          Profile
        </button>
        <button className="button" onClick={toggleDarkMode}>
          Dark Mode
        </button>
        <button className="button" onClick={firstHandleClick}>
          Log Out
        </button>
      </div>
    </nav>
  );
}