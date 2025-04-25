import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python'; 
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion } from '@codemirror/autocomplete';
import { useSnippets } from '../../context/SnippetContext';

const CodeEditor = ({ height }) => {
  if (typeof window === 'undefined') {
    return (
      <div className="cm-theme" style={{ width: '100%' }} />
    );
  }
  

  const { file, setFile } = useSnippets();
  const [code, setCode] = useState('');

  useEffect(() => {
    setCode(file);
  }, [file]);

  return (
    <CodeMirror
      value={code}
      style={{ width: '100%' }}
      height={`${height}px`}
      extensions={[python(), autocompletion({ activateOnTyping: false })]}
      theme={oneDark}
      onChange={(value) => {
        setCode(value);
        setFile(value);
      }}
    />
  );
};



export default CodeEditor;