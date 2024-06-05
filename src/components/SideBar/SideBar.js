import React, { useState } from 'react';
import clockIcon from "./assets/clock-icon.svg";
import './SideBar.css';

import { useSnippets } from '../../context/SnippetContext';

const SideBar = () => {
    const { snippets, selectedId, handleSnippetClick } = useSnippets();
    
    return (
        <div className="side">
            <div className="side-heading">
                <img src={clockIcon} draggable="false" />
                <p>Recent</p>
            </div>
            {snippets.map((snippet) => (
                <div key={snippet.id}
                     className={`recent-snippet ${snippet.id === selectedId ? 'recent-snippet-selected' : ''}`}
                     onClick={() => handleSnippetClick(snippet.id)}>
                    <p>{snippet.title}</p>
                </div>
            ))}
        </div>
    );
}

export default SideBar;

/*
export default SideBar;


    return (
        <div className="side">
            <div className="side-heading">
                <img src={clockIcon} draggable="false" />
                <p>Recent</p>
            </div>
            {snippets.map((snippet) => (
                <div key={snippet.id}
                     className={`recent-snippet ${snippet.id === selectedId ? 'recent-snippet-selected' : ''}`}
                     onClick={() => handleSnippetClick(snippet.id)}>
                    <p>{snippet.title}</p>
                </div>
            ))}
            {/* Optionally, you could add a button to trigger reordering }
            <button onClick={moveSnippetToFront}>Reorder Snippets</button>
        </div>
    );
}

export default SideBar;
*/