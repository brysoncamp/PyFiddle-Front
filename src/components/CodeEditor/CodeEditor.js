import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python'; 
import { oneDark } from '@codemirror/theme-one-dark';

function CodeEditor() {
  const [code, setCode] = React.useState("");

  return (
    <CodeMirror
      value={code}
      style={{width: "100%"}}
      height="60vh"
      extensions={[python()]} 
      theme={oneDark}
      onChange={(value, viewUpdate) => {
        setCode(value);
        console.log(value);
      }}
    />
  );
}

export default CodeEditor;
