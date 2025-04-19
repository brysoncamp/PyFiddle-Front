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


  useEffect(() => {
    workerRef.current = new Worker('/pyodideWorker.js');

    workerRef.current.onmessage = (event) => {
      const { type, message, error } = event.data;
      if (type === 'log') {
        setOutput(prevOutput => [...prevOutput.slice(0, -1), message, ""]);
      } else if (type === 'package-log') {
        setOutput(prevOutput => [...prevOutput.slice(0, -1), <span style={{ color: '#56b6c2' }}>{message}</span>,  ...(message.includes('Loaded ') ? ["", ""] : [""])]);
      } else if (type === 'error') {
        console.log("error message", error);
        const cleanedError = "Error: " + error.toString().split(`<exec>", `)[1];
        console.log("ERROR", cleanedError);

        setOutput(prevOutput => error
          ? [
              ...prevOutput.slice(0, -1),
              ...cleanedError.split('\n').map((line, i) => (
                <span key={i} style={{ color: '#e06c75', whiteSpace: 'pre-wrap' }}>
                  {line}
                  <br />
                </span>
              ))
              ,
              ">", ""
            ]
          : [...prevOutput, ">", ""]
        );
        
        setRunCode(false);
      } else if (type === 'success') {
        setOutput(prevOutput => [...prevOutput, ">", ""]);
        setRunCode(false);
      } else if (type === 'ready') {
        setOutput(prevOutput => [...prevOutput.slice(0, -1), ">", ""]);
        setWorkerReady(true);
        initLoadingRef.current = false;
      }
    };

    return () => {
      workerRef.current.terminate();
    };
  }, []); 

  

  useEffect(() => {
    if (!workerRef.current) return;

    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (!initLoadingRef.current && libraries) {
      if (libraries.length > 0) {
        setOutput(prev => [...prev.slice(0, -2), "> Loading...", "", ""]);
      } else {
        setOutput(prev => [...prev.slice(0, -2), "> Loading...", "", ""]);
      }

      console.log("sending init message", libraries);
      setWorkerReady(false);
      initLoadingRef.current = true;
      workerRef.current.postMessage({ type: 'init', packages: libraries });
    }
  }, [libraries]);
  

  useEffect(() => {
    if (runCode && file && workerRef.current && workerReady) {
      console.log(libraries);
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