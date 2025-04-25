import React, { createContext, useState, useContext, useEffect } from 'react';
//import { useLocation, useNavigate } from 'react-router-dom';

import { navigate } from 'vike/client/router';
import { usePageContext } from '../../renderer/usePageContext.jsx'; 

const SnippetContext = createContext();

export const useSnippets = () => useContext(SnippetContext);

export const SnippetProvider = ({ children }) => {

    //const location = useLocation();
    const { urlPathname, routeParams } = usePageContext();
    const location = urlPathname;
    //const navigate = useNavigate();

    const [runCode, setRunCode] = useState(false);
    const [runComplete, setRunComplete] = useState(false);
    const [editName, setEditName] = useState(false);
    const [runSave, setRunSave] = useState(false);

    // const [libraries, setLibraries] = useState(() => {
    //     const savedLibraries = localStorage.getItem('libraries');
    //     return savedLibraries ? JSON.parse(savedLibraries) : [];
    // });
    const [libraries, setLibraries] = useState(() => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem('libraries');
        return saved ? JSON.parse(saved) : [];
    });

      

    useEffect(() => {
        localStorage.setItem('libraries', JSON.stringify(libraries));
    }, [libraries]);

    const [snippets, setSnippets] = useState([]);
    const [selectedId, setSelectedId] = useState(-1);

    // Local storage handling here:
    const LOCAL_STORAGE_KEY_CODE = 'pyfiddle-current-code';
    const LOCAL_STORAGE_KEY_NAME = 'pyfiddle-current-fileName';

    // const [file, setFile] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEY_CODE) || "");
    // const [fileName, setFileName] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEY_NAME) || (location.pathname === "/" ? "Untitled Snippet" : ""));
    const [file, setFile] = useState(() => {
        if (typeof window === 'undefined') return "";
        return localStorage.getItem(LOCAL_STORAGE_KEY_CODE) || "";
      });
      
      const [fileName, setFileName] = useState(() => {
        if (typeof window === 'undefined') return "";
        return localStorage.getItem(LOCAL_STORAGE_KEY_NAME) || (location === "/" ? "Untitled Snippet" : "");
      });
      

    // Sync file and fileName to LocalStorage whenever they change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_CODE, file);
    }, [file]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_NAME, fileName);
    }, [fileName]);

    const handleSnippetClick = (id) => {
        setSelectedId(id);
    };

    const moveSnippetToFront = () => {
        if (selectedId !== null && snippets.length > 0) {
            setSnippets(prev => {
                const snippet = prev.find(s => s.id === selectedId);
                if (!snippet) return prev;
                const others = prev.filter(s => s.id !== selectedId);
                return [snippet, ...others];
            });
        }
    };

    const getFile = (gistData, gistFileName) => {
        let file = gistData.files[`${gistFileName}.py`];
        if (!file) {
            const fileKeys = Object.keys(gistData.files);
            file = gistData.files[fileKeys[0]];
        }
        return file;
    };

    const handleFetchSnippet = () => {
        const path = location.slice(1);
        if (path === "") {
            setFile(localStorage.getItem(LOCAL_STORAGE_KEY_CODE) || "");
            setFileName(localStorage.getItem(LOCAL_STORAGE_KEY_NAME) || "Untitled Snippet");
        } else if (path.length === 8) {
            const fetchSnippet = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_PYFIDDLE_API_URI}/snippet/${path}`, { credentials: 'include' });
                    if (response.ok) {
                        const { gistData, fileName } = await response.json();
                        const file = getFile(gistData, fileName);
                        setFile(file.content);
                        setFileName(fileName);
                    } else {
                        navigate('/');
                    }
                } catch {
                    navigate('/');
                }
            };
            fetchSnippet();
        } else if (path !== 'account' && path !== 'manage') {
            navigate('/');
        }
    };

    useEffect(() => {
        handleFetchSnippet();
    }, [location.pathname]);

    return (
        <SnippetContext.Provider value={{ 
            snippets, selectedId, handleSnippetClick, moveSnippetToFront, 
            file, fileName, setFile, setFileName, 
            runCode, setRunCode, runComplete, setRunComplete, 
            libraries, setLibraries, setRunSave, editName, setEditName 
        }}>
            {children}
        </SnippetContext.Provider>
    );
};
