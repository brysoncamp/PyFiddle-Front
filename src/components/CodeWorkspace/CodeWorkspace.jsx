import React, { useState, useCallback, useRef, useEffect } from 'react';
import CodeEditor from '../CodeEditor/CodeEditor.jsx';
import Output from '../Output/Output.jsx';

import "./CodeWorkspace.css";

const CodeWorkspace = () => {


    const [editorHeight, setEditorHeight] = useState(300);
    const currentHeightRef = useRef(300);
    const previousWindowHeightRef = useRef(typeof window !== 'undefined' ? window.innerHeight : 1080);
    /*
    const [editorHeight, setEditorHeight] = useState(() => {
        const savedHeight = localStorage.getItem('editorHeight');
        return savedHeight ? parseInt(savedHeight, 10) : 300;
    });
    */
    //const currentHeightRef = useRef(editorHeight);
    //const previousWindowHeightRef = useRef(window.innerHeight);
    const startYRef = useRef(0);
    const isResizingRef = useRef(false);
    const dividerRef = useRef(null);

    const startResizing = useCallback((mouseDownEvent) => {
        dividerRef.current.classList.add("dividing");
        startYRef.current = mouseDownEvent.clientY;
        isResizingRef.current = true;
        mouseDownEvent.preventDefault();
        document.body.style.cursor = 'ns-resize';
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
    }, []);

    const resize = useCallback((mouseMoveEvent) => {
        if (isResizingRef.current) {
            const currentY = mouseMoveEvent.clientY;
            const heightDiff = currentY - startYRef.current;
            const newHeight = Math.max(50, currentHeightRef.current + heightDiff);
            const maxEditorHeight = window.innerHeight - 50 - 6 - 54;

            if (newHeight <= maxEditorHeight && newHeight !== currentHeightRef.current) {
                setEditorHeight(newHeight);
                currentHeightRef.current = newHeight;
                startYRef.current = currentY;
            } else if (newHeight !== currentHeightRef.current) {
                setEditorHeight(maxEditorHeight);
                currentHeightRef.current = maxEditorHeight;
            }
        }
    }, []);

    const stopResizing = useCallback(() => {
        if (dividerRef.current) {
            dividerRef.current.classList.remove("dividing");
        }
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResizing);
        isResizingRef.current = false;
    }, [resize]);

    const handleWindowResize = useCallback(() => {
        const totalHeight = window.innerHeight;
        const maxEditorHeight = totalHeight - 50 - 6 - 54;
        const maxOutputHeight = totalHeight - 50 - 6 - 54; 

        const heightDiff = totalHeight - previousWindowHeightRef.current;
        const newEditorHeight = Math.min(currentHeightRef.current + heightDiff, maxEditorHeight);
        const newOutputHeight = totalHeight - newEditorHeight;

        if (newOutputHeight > maxOutputHeight) {
            setEditorHeight(totalHeight - maxOutputHeight);
            currentHeightRef.current = totalHeight - maxOutputHeight;
        } else {
            setEditorHeight(newEditorHeight);
            currentHeightRef.current = newEditorHeight;
        }

        previousWindowHeightRef.current = totalHeight;
    }, []);

    // useEffect(() => {
    //     localStorage.setItem('editorHeight', editorHeight);
    // }, [editorHeight]);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleWindowResize]);

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", overflow: "hidden" }}>
            <div style={{ height: `${editorHeight}px` }}>
                <CodeEditor height={editorHeight} />
            </div>
            <div ref={dividerRef}
                className="divider"
                onMouseDown={startResizing}
                style={{ height: "5px", cursor: "ns-resize", background: "transparent" }}
            />
            <div style={{ flex: 1, minHeight: '50px', overflow: 'auto' }}>
                <Output />
            </div>
        </div>
    );
}

export default CodeWorkspace;
