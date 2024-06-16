import React, { useState, useEffect } from 'react';
import './NavBar.css';
import githubLogo from "./assets/github-logo.svg";
import plusIcon from "./assets/plus-icon.svg";
import shareIcon from "./assets/share-icon.svg";
import forkIcon from "./assets/fork-icon.svg";
import whiteLogo from "./assets/white-logo.svg";
import playIcon from "./assets/play-icon.svg";
import saveIcon from "./assets/save-icon.svg";
import { useLocation, useNavigate,  Link } from 'react-router-dom';
import { useSnippets } from '../../context/SnippetContext';

const NavBar = ({ session }) => {
  const { handleSnippetClick, moveSnippetToFront, file, fileName, setFileName,  runCode, setRunCode, setRunSave } = useSnippets();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const userLoggedIn = session && session.loginSuccess;
  const isApplicationPage = location.pathname !== "/snippets" && location.pathname !== "/account";

  /*useEffect(() => {
    console.log("Location changed:", location.pathname);
  }, [fileName]);*/

  const placeholder = "Untitled Snippet";
  //const [text, setText] = useState(fileName || placeholder); // fileName

  /*useEffect(() => {
    setText(fileName || placeholder);
  }, [fileName])*/

  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const pyfiddleApiUri = import.meta.env.VITE_PYFIDDLE_API_URI;
  const redirectUri = `${pyfiddleApiUri}/auth`;
  const currentUrl = window.location.href;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=gist&redirect_uri=${redirectUri}&state=${encodeURIComponent(currentUrl)}`;

  const handleChange = (event) => {
    setFileName(event.target.value)
  };

  const handleBlur = () => {
    if (fileName.trim() === "") {
      setFileName("Untitled Snippet");
    }
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  const animateLoad = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  }

  useEffect(() => {
    if (!runCode) {
      setIsLoading(false);
    }
  }, [runCode])

  const handleRun = () => {

    if (!file.trim() || runCode) return;

    setIsLoading(true);
    setRunCode(true);
    moveSnippetToFront();
    handleSave();
  }

  const handleNew = () => {
    setFileName("Untitled Snippet");
    handleSnippetClick(-1);
    navigate("/");
  }

  const handleSave = async () => {

    if (!file.trim()) return;

    //setRunSave(true);
    moveSnippetToFront();
    animateLoad();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    try {
      const path = location.pathname.slice(1);
      const response = await fetch(`${pyfiddleApiUri}/snippet`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 
          name: fileName,
          path: path,
          content: file
        }),
        credentials: 'include'
      })
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // only navigate if the path is different
        if (result.path !== location.pathname.slice(1)) navigate(`/${result.path}`);
      } else {
        console.error(response);
        throw new Error('Failed to save snippet.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleRun();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [file, fileName, location.pathname]);
  

  return (
    <nav>
      <div className="nav-left">
        <div className="logo" onClick={handleNew}>
          <img src={whiteLogo} alt="PyFiddle Logo" draggable="false" />
          <p>PyFiddle</p>
        </div>
        {isApplicationPage && (
          <>
            <div onClick={handleRun} className="nav-button">
              <img style={{width: "0.75rem"}} src={playIcon} draggable="false" />
              <p>Run</p>
            </div>
            <div onClick={() => { moveSnippetToFront(); handleSave(); }} className="nav-button">
              <img src={saveIcon} draggable="false" />
              <p>Save</p>
            </div>
          </>
        )}
      </div>
      <div className="nav-center">  
        {isApplicationPage ? (
          <input className="input" value={fileName} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} size={fileName.length + 1} placeholder={placeholder} />
        ) : (
          <input value={location.pathname === "/account" ? "Account Settings" : "Manage Snippets"} tabIndex={-1} onMouseDown={(e) => e.preventDefault()} onFocus={(e) => e.target.blur()} />
        )}
      </div>
      <div className="nav-right">
        {isApplicationPage && (
          <>
            <div className="nav-button">
              <img src={shareIcon} draggable="false" />
              <p>Share</p>
            </div>
            <div className="nav-button">
              <img style={{width: "0.75rem"}} src={forkIcon} draggable="false" />
              <p>Fork</p>
            </div>
          </>
        )}
        <div className="nav-button" onClick={handleNew}>
          <img src={plusIcon} draggable="false" />
          <p>New Snippet</p>
        </div>
        {userLoggedIn ? (
          <div>
            <Link to="/account" className="sign-in nav-button">
              <img src={githubLogo} draggable="false" alt="GitHub Logo" />
              <p>{session.username}</p>
            </Link>
          </div>
        ) : (
          <a href={githubAuthUrl} className="sign-in nav-button">
            <img src={githubLogo} draggable="false" alt="GitHub Logo" />
            <p>Sign in with GitHub</p>
          </a>
        )}
      </div>
      {isLoading && <div className="loading-bar"></div>}
    </nav>
  );
};

export default NavBar;