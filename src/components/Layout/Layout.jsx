export { Layout };

import React, { useState, useEffect } from 'react';

import { SnippetProvider } from '../../context/SnippetContext.jsx';
import NavBar from '../NavBar/NavBar.jsx';
import SideBar from '../SideBar/SideBar.jsx';


const Layout = ({ children }) => {

  const [session, setSession] = useState(null);
  const sessionUri = `${import.meta.env.VITE_PYFIDDLE_API_URI}/session`;
  
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(sessionUri, {
          credentials: 'include'
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        setSession(data);
      } catch (error) {
        console.error('Error fetching session data:', error);
        setSession({ loginSuccess: false });
      }
    };

    fetchSession();
  }, [sessionUri]);


  return (
    <React.StrictMode>
      <SnippetProvider>
        <NavBar session={session} />
        <div style={{ display: "flex", height: "100%" }}>
          <SideBar />
          { children }
        </div> 
      </SnippetProvider>
    </React.StrictMode>
  )
};