import React, { createContext, useState, useContext } from 'react';

const SnippetContext = createContext();

export const useSnippets = () => useContext(SnippetContext);

export const SnippetProvider = ({ children }) => {
    const [snippets, setSnippets] = useState([
        { id: 0, title: "Untitled Snippet" },
        { id: 1, title: "My Snippet Name" },
        { id: 2, title: "Interesting Project" },
        { id: 3, title: "This snippet name is quite long really too long" }
    ]);
    const [selectedId, setSelectedId] = useState(0);

    const handleSnippetClick = (id) => {
        setSelectedId(id);
    };

    const moveSnippetToFront = () => {
        if (selectedId !== null) {
            setSnippets(prev => {
                const snippet = prev.find(s => s.id === selectedId);
                const others = prev.filter(s => s.id !== selectedId);
                return [snippet, ...others];
            });
        }
    };

    return (
        <SnippetContext.Provider value={{ snippets, selectedId, handleSnippetClick, moveSnippetToFront }}>
            {children}
        </SnippetContext.Provider>
    );
};
