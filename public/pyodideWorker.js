self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js');

const originalLog = console.log;
console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('Loading ') || message.includes('Loaded ')) {
        self.postMessage({ type: 'package-log', message });
    } else {
        self.postMessage({ type: 'log', message });
    }
    originalLog.apply(console, args);
};

const loadRequiredPackages = async (packages) => {
    for (const pkg of packages) {
        await self.pyodide.loadPackage(pkg);
    }
};

const loadPyodideAndRun = async (code, packages) => {
    self.pyodide = await loadPyodide();
    try {
        if (packages.length > 0) {
            await loadRequiredPackages(packages);
        }
        const result = await self.pyodide.runPythonAsync(code);
        self.postMessage({ type: 'success', result });
    } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
    }
};

self.onmessage = (event) => {
    const { code, packages } = event.data;
    loadPyodideAndRun(code, packages);
};