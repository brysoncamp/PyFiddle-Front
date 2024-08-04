import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SnippetContext = createContext();

export const useSnippets = () => useContext(SnippetContext);

export const SnippetProvider = ({ children }) => {

    const location = useLocation();
    const navigate = useNavigate();

    const [runCode, setRunCode] = useState(false);
    const [runComplete, setRunComplete] = useState(false);

    const [editName, setEditName] = useState(false);

    const [runSave, setRunSave] = useState(false);

    const [libraries, setLibraries] = useState(() => {
        const savedLibraries = localStorage.getItem('libraries');
        return savedLibraries ? JSON.parse(savedLibraries) : [];
    })

    useEffect(() => {
        localStorage.setItem('libraries', JSON.stringify(libraries));
    }, [libraries])

    const [snippets, setSnippets] = useState([]);

    useEffect(() => {
        const fetchSnippets = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_PYFIDDLE_API_URI}/snippets`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    const sortedData = data.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
                    const processedData = sortedData.map((snippet, index) => ({
                        id: index,
                        title: snippet.name,
                        path: snippet.path
                    }));

                    setSnippets(processedData);
                    
                    const path = location.pathname.slice(1);
                    const foundSnippet = processedData.find(snippet => snippet.path === path);
                    if (foundSnippet) {
                        setSelectedId(foundSnippet.id);
                    }
                }
            } catch (error) {
                console.error('Error fetching snippet:', error);
            }
        };

        fetchSnippets();
    }, [location.pathname]);

    const [selectedId, setSelectedId] = useState(-1);
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState(location.pathname === "/" ? "Untitled Snippet" : " ");

    const handleSnippetClick = (id) => {
        setSelectedId(id);
    };

    const moveSnippetToFront = () => {
        try {
            if (selectedId !== null && Array.isArray(snippets) && snippets.length > 0) {
                setSnippets(prev => {
                    const cleanSnippets = prev.filter(s => s !== undefined);
                    const snippet = cleanSnippets.find(s => s.id === selectedId);
                    if (!snippet) {
                        console.error('No snippet found with the given ID:', selectedId);
                        return prev;
                    }
                    const others = cleanSnippets.filter(s => s.id !== selectedId);
                    return [snippet, ...others];
                });
            }
        } catch (error) {
            console.error('Failed to move snippet to front:', error);
        }
    };
    
    const getFile = (gistData, fileName) => {

        if (!gistData) console.log("NO GIST DATA");
        let file = gistData.files[`${fileName}.py`];

        if (!file) {
            const fileKeys = Object.keys(gistData.files);
            if (fileKeys.length > 0) {
                file = gistData.files[fileKeys[0]];
            }
        }
    
        return file;
    }

    const handleFetchSnippet = () => {
        const path = location.pathname.slice(1);
        if (path === "") {
            setFile("");
        } else if (path.length === 8) {
            const fetchSnippet = async () => {
                setFile("");
                try {
                    const response = await fetch(`${import.meta.env.VITE_PYFIDDLE_API_URI}/snippet/${path}`, {
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const { gistData, fileName } = await response.json();
                        console.log(gistData);
                        console.log(fileName);
                        const file = getFile(gistData, fileName);
                        setFile(file.content);
                        setFileName(fileName);

                    } else {
                        console.error(`Failed to fetch snippet path ${path}.`);
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Error fetching snippet:', error);
                    navigate('/');
                }
            };

            fetchSnippet();
        } else if (path !== 'account' & path !== 'manage') {
            console.error(`Snippet path ${path} does not exist`);
            navigate('/');
        }
    }

    useEffect(() => {
        handleFetchSnippet();
    }, [location, navigate]);

    useEffect(() => {
        handleFetchSnippet();
        if (runSave) {
            setRunSave(false);
        }
    }, [runSave]);

    return (
        <SnippetContext.Provider value={{ snippets, selectedId, handleSnippetClick, moveSnippetToFront, file, fileName, setFile, setFileName, runCode, setRunCode, runComplete, setRunComplete, libraries, setLibraries, setRunSave, editName, setEditName }}>
            {children}
        </SnippetContext.Provider>
    );
};
