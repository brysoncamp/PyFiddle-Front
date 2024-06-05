import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import SideBar from './components/SideBar/SideBar';
import CodeEditor from './components/CodeEditor/CodeEditor';

import { SnippetProvider } from './context/SnippetContext';

import './App.css';

const App = () => {
	return (
	  <SnippetProvider>
		<NavBar />
		<div style={{ display: "flex", height: "100%" }}>
			<SideBar />
			<CodeEditor />
		</div>
	  </SnippetProvider>
	);
}

export default App;
