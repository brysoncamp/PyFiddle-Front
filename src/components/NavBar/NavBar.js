import React, { useState } from 'react';
import './NavBar.css';
import githubLogo from "./assets/github-logo.svg";
import plusIcon from "./assets/plus-icon.svg";
import shareIcon from "./assets/share-icon.svg";
import forkIcon from "./assets/fork-icon.svg";

//import { Link } from 'react-router-dom';

const NavBar = () => {
  const placeholder = "Untitled Snippet";
  const [text, setText] = useState(placeholder);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    if (text.trim() === "") {
      setText(placeholder);
    }
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  return (
    <nav>
      <div className="nav-left"></div>
      <div className="nav-center">
        <input value={text} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} size={text.length + 1} placeholder={placeholder} />
      </div>
      <div className="nav-right">
        <div className="nav-button">
          <img src={shareIcon} />
          <p>Share</p>
        </div>
        <div className="nav-button">
          <img src={forkIcon} />
          <p>Fork</p>
        </div>
        <div className="nav-button">
          <img src={plusIcon} />
          <p>New Snippet</p>
        </div>
        <div className="sign-in nav-button">
          <img src={githubLogo} />
          <p>Sign in with Github</p>
        </div>
      </div>
    </nav>
  );
};




/* Uncomment below code to display the NavBar
<nav style={styles.navStyle}>
  <ul style={styles.ulStyle}>
    <li style={styles.liStyle}><Link to="/">Home</Link></li>
    <li style={styles.liStyle}><Link to="/about">About</Link></li>
    <li style={styles.liStyle}><Link to="/contact">Contact</Link></li>
  </ul>
</nav>
*/

export default NavBar;