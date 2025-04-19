self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js');

const originalLog = console.log;
console.log = (...args) => {
  const message = args.join(' ');

  const ignoreMessages = [
    'already loaded from default channel',
    'No new packages to load'
  ];

  if (ignoreMessages.some(text => message.includes(text))) return;

  if (message.includes('Loading ') || message.includes('Loaded ')) {
    self.postMessage({ type: 'package-log', message });
  } else {
    self.postMessage({ type: 'log', message });
  }
  originalLog.apply(console, args);
};

// ✅ Fix: use a function to always ensure pyodide is reloaded properly
let pyodide = null;
let pyodideReadyPromise = null;

const ensurePyodideReady = () => {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = loadPyodide().then((instance) => {
      pyodide = instance;
      return instance;
    });
  }
  return pyodideReadyPromise;
};

const loadRequiredPackages = async (packages = []) => {
  for (const pkg of packages) {
    await pyodide.loadPackage(pkg);
  }
};

const cleanError = (err) => {
  return err.split("<module> ")[1];
};

self.onmessage = async (event) => {
  const { type, code, packages = [] } = event.data;

  // ✅ Fix: Always ensure Pyodide is ready (this re-inits if Worker restarted)
  await ensurePyodideReady();

  if (type === 'init') {
    try {
      await loadRequiredPackages(packages);
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'error', error: cleanError(error.message) });
    }
    return;
  }

  if (type === 'runPython') {
    try {
      await loadRequiredPackages(packages);
      const result = await pyodide.runPythonAsync(code);
      self.postMessage({ type: 'success', result });
    } catch (error) {
      self.postMessage({ type: 'error', error: error.message });
    }
  }
};
