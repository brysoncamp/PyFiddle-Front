import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import SideBar from './components/SideBar/SideBar';
import CodeEditor from './components/CodeEditor/CodeEditor';

import './App.css';

const App = () => {
	return (
	  <Router>
		<NavBar />
		<div style={{ display: "flex", height: "100%" }}>
			<SideBar />
			<CodeEditor />
		</div>
	  </Router>
	);
}

export default App;
