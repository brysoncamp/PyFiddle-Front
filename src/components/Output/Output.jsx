import React, { useState, useEffect, useRef } from 'react';
import "./Output.css";
import terminalIcon from "./assets/terminal-icon.svg";
import trashIcon from "./assets/trash-icon.svg";
import { useSnippets } from '../../context/SnippetContext';

const Output = () => {
  const { file, runCode, setRunCode, libraries } = useSnippets();
  const [output, setOutput] = useState(['>', '']);
  const [autoScroll, setAutoScroll] = useState(true);
  const outputRef = useRef(null);
  const workerRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  const [workerReady, setWorkerReady] = useState(false);
  const initLoadingRef = useRef(false); // 🛡️ Ref to track if init is already happening
  const hasMounted = useRef(false); 


  const pendingLibrariesRef = useRef(null);
  const lastInitializedLibrariesRef = useRef(null);




  useEffect(() => {
    //workerRef.current = new Worker('/pyodideWorker.js');
    workerRef.current = new Worker(new URL('../../workers/pyodideWorker.js', import.meta.url), { type: 'module' })

    workerRef.current.onmessage = (event) => {
      const { type, message, error } = event.data;
    
      const flushPendingInit = () => {
        const nextLibs = pendingLibrariesRef.current;
        if (!nextLibs) return false;
    
        pendingLibrariesRef.current = null;
        console.log("LOADING HERE 2");
        setTimeout(() => setOutput(prev => [...prev.slice(0, -2), "> Loading...", "", "", ""]), 0);
        
        setWorkerReady(false);
        initLoadingRef.current = true;
        workerRef.current.postMessage({ type: 'init', packages: nextLibs });
        console.log('[Output] Flushed pending init', nextLibs);
        return true;
      };
    
      switch (type) {
        case 'log':
          setOutput(prev => [...prev.slice(0, -1), message, ""]);
          break;
    
        case 'package-log':
          setOutput(prev => [
            ...prev.slice(0, -2),
            <span style={{ color: '#56b6c2' }}>{message}</span>,
            ...(message.includes('Loaded ') ? ["", "", ""] : [""])
          ]);
          break;
    
        case 'error':
          console.log("error message", error);
          if (!error?.includes("<exec>")) return;
          const cleanedError = "Error: " + error.toString().split(`<exec>", `)[1];
          setOutput(prev => [
            ...prev.slice(0, -1),
            ...cleanedError.split('\n').map((line, i) => (
              <span key={i} style={{ color: '#e06c75', whiteSpace: 'pre-wrap' }}>
                {line}
                <br />
              </span>
            )),
            ">", ""
          ]);
          setRunCode(false);
          flushPendingInit() || setWorkerReady(true);
          break;
    
        case 'success':
          setOutput(prev => [...prev, ">", ""]);
          setRunCode(false);
          flushPendingInit() || setWorkerReady(true);
          break;
    
        case 'ready':
          console.log('[Output] Worker ready');
          initLoadingRef.current = false;
          flushPendingInit() || (() => {
            setOutput(prev => {
              const lastNonEmpty = prev.findLastIndex(item => item !== "");
              return [...prev.slice(0, lastNonEmpty + 1), "", ">", ""];
            });
            
            setWorkerReady(true)
          })();
          break;
      }
    };
    

    return () => {
      workerRef.current.terminate();
    };
  }, []); 

  

  // useEffect(() => {
  //   if (!workerRef.current) return;

  //   console.log("running libraries loading effect", libraries);

  //   // if (!hasMounted.current) {
  //   //   hasMounted.current = true;
  //   //   return;
  //   // }

  //   if (!initLoadingRef.current && libraries) {
  //     if (libraries.length > 0) {
  //       setOutput(prev => [...prev.slice(0, -2), "> Loading...", "", ""]);
  //     } else {
  //       setOutput(prev => [...prev.slice(0, -2), "> Loading...", "", ""]);
  //     }

  //     console.log("sending init message", libraries);
  //     setWorkerReady(false);
  //     initLoadingRef.current = true;
  //     workerRef.current.postMessage({ type: 'init', packages: libraries });
  //   }
  // }, [libraries]);

  // 👇 On libraries change
  useEffect(() => {
    if (!workerRef.current || !libraries) return;

    if (workerReady) {
      console.log('[Output] Worker is ready, sending init now', libraries);
      setWorkerReady(false);
      initLoadingRef.current = true;
      workerRef.current.postMessage({ type: 'init', packages: libraries });
      setTimeout(() => setOutput(prev => [...prev.slice(0, -3), "", "> Loading...", "", "", ""]), 0);
      console.log("LOADING HERE 1");
    } else {
      console.log('[Output] Worker not ready, deferring init', libraries);
      pendingLibrariesRef.current = libraries;
    }
  }, [libraries]);

  
  
  

  useEffect(() => {
    if (runCode && file && workerRef.current && workerReady) {
      console.log('[Output] Sending runPython', libraries);
      setWorkerReady(false); // ⛔ Not ready during execution
      setOutput(prevOutput => [...prevOutput.slice(0, -2), '> Running...', '', '']);
      workerRef.current.postMessage({ type: 'runPython', code: file, packages: libraries });
    }
  }, [file, runCode, libraries, workerReady]);
  



  useEffect(() => {
    if (outputRef.current) {
      const { scrollHeight, clientHeight } = outputRef.current;
      if (autoScroll) {
          outputRef.current.scrollTop = scrollHeight - clientHeight;
      }
    }
  }, [output, autoScroll]);

  useEffect(() => {
    if (runCode) {
      setAutoScroll(true);
    }
  }, [runCode]);

  const clearOutput = () => setOutput([">"]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = outputRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const scrolledUp = scrollTop < lastScrollTopRef.current;

    if (scrolledUp) {
      setAutoScroll(false);
    } else if (isAtBottom) {
      setAutoScroll(true);
    }

    lastScrollTopRef.current = scrollTop;
  };

  return (
    <div className="output">
      <div className="output-top">
        <img className="terminal-icon" src={terminalIcon} draggable="false" />
        <p>OUTPUT</p>
        <div className="flex-grow"></div>
        <div className="nav-button clear-button" onClick={clearOutput}>
          <img src={trashIcon} draggable="false"/>
          <p>Clear</p>
        </div>
      </div>
      <div className="output-content" onScroll={handleScroll} ref={outputRef}>
        { output.map((line, index) => <div key={index}>{line || <br />}</div>) }
      </div>
    </div>
  );
};

export default Output;