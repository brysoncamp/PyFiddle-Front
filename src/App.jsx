import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar.jsx';
import SideBar from './components/SideBar/SideBar.jsx';
import CodeEditor from './components/CodeEditor/CodeEditor.jsx';
import Account from './components/Account/Account';

import CodeWorkspace from './components/CodeWorkspace/CodeWorkspace.jsx';

import { SnippetProvider } from './context/SnippetContext.jsx';

import './App.css';

const App = () => {

	const [session, setSession] = useState(null);
	const [snippetContent, setSnippetContent] = useState(null);
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
		<Router>
			<SnippetProvider>
				<NavBar session={session} />
				<div style={{ display: "flex", height: "100%" }}>
					<SideBar />
					<Routes>
						<Route path="/" element={<CodeWorkspace />} />
						<Route path="/account" element={<Account />} />
						<Route path="*" element={<CodeWorkspace />} />
					</Routes>
				</div>
			</SnippetProvider>
		</Router>
	);
}

export default App;