import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import clockIcon from "./assets/clock-icon.svg";
import libraryIcon from "./assets/library-icon.svg";
import './SideBar.css';

import { useSnippets } from '../../context/SnippetContext.jsx';


const availableLibraries = [
    { id: 1, name: "numpy", isChecked: false },
    { id: 2, name: "pandas", isChecked: false },
    { id: 3, name: "scipy", isChecked: false },
    { id: 4, name: "scikit-learn", isChecked: false },
    { id: 5, name: "sympy", isChecked: false }
];

const SideBar = () => {
    const { snippets, selectedId, handleSnippetClick, libraries, setLibraries, fileName, setFileName, editName, setEditName } = useSnippets();

    const navigate = useNavigate();

    const [librarySelections, setLibrarySelections] = useState([]);
    
    useEffect(() => {
        const updatedLibrarySelections = availableLibraries.map(lib => ({
            ...lib,
            isChecked: libraries.includes(lib.name)
        }));
        setLibrarySelections(updatedLibrarySelections);
    }, [libraries]);

    const [isLibrariesVisible, setLibrariesVisible] = useState(true);
    const [isSnippetsVisible, setSnippetsVisible] = useState(true);
    
    const toggleCheckbox = (id) => {
        const newLibrarySelections = librarySelections.map(librarySelection => 
            librarySelection.id === id ? { ...librarySelection, isChecked: !librarySelection.isChecked } : librarySelection
        );
        setLibrarySelections(newLibrarySelections);

        const newLibraries = newLibrarySelections.filter(library => library.isChecked).map(library => library.name);
        setLibraries(newLibraries);
    };

    const toggleLibrariesVisibility = () => {
        setLibrariesVisible(!isLibrariesVisible);
    };

    const toggleSnippetsVisibility = () => {
        setSnippetsVisible(!isSnippetsVisible);
    };

    const handleDivClick = (id, event) => {
        event.preventDefault();
        toggleCheckbox(id);
    };

    return (
        <div className="side">
            <div className="side-heading" onClick={toggleSnippetsVisibility}>
                <img src={clockIcon} draggable="false" />
                <p>Recent</p>
            </div>
            <div className={`library-container ${isSnippetsVisible ? 'expanded' : 'collapsed'}`}>
                {snippets && snippets.length > 0 && snippets.map((snippet) => (
                    snippet && (
                        <div key={snippet.id}
                            className={`recent-snippet ${snippet.id === selectedId ? 'recent-snippet-selected' : ''}`}
                            onClick={() => { setEditName(false), setFileName(snippet.title); handleSnippetClick(snippet.id); navigate(snippet.path) }}>
                            <p>{snippet.id === selectedId && editName ? fileName : snippet.title}</p>
                        </div>
                    )
                ))}
            </div>

            <div className="side-heading" onClick={toggleLibrariesVisibility}>
                <img src={libraryIcon} draggable="false" />
                <p>Libraries</p>
            </div>
            <div className={`library-container ${isLibrariesVisible ? 'expanded' : 'collapsed'}`}>
                {librarySelections.map((librarySelection) => (
                    <div key={librarySelection.id} className="recent-snippet" onClick={(event) => handleDivClick(librarySelection.id, event)}>
                        <p>{librarySelection.name}</p>
                        <div className="flex-grow"></div>
                        <label className="switch">
                            <input type="checkbox" checked={librarySelection.isChecked} readOnly />
                            <span className="slider"></span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SideBar;
