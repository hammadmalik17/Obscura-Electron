const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Keep a global reference of the window object
let mainWindow;
let pythonProcess = null;

function createWindow() {
  // Create the browser window with Obsidian-like styling
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    titleBarStyle: 'hiddenInset', // Modern title bar
    backgroundColor: '#0a0a0a', // Dark background
    show: false, // Don't show until ready
    icon: path.join(__dirname, 'assets/icon.png')
  });

  // Load the app
  mainWindow.loadFile('index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Focus window
    if (process.platform === 'darwin') {
      app.dock.show();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    // Clean up Python process
    if (pythonProcess) {
      pythonProcess.kill();
      pythonProcess = null;
    }
  });

  // Development tools (remove in production)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Clean up Python process
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Enhanced Python communication helper - BUNDLED PYTHON ONLY
function executePythonCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, 'obscura_backend.py');
    
    console.log(`[DEBUG] Executing Python command: ${command} with args:`, args);
    console.log(`[DEBUG] Python script path: ${pythonPath}`);
    
    // Check if Python file exists
    if (!fs.existsSync(pythonPath)) {
      const error = `Python backend not found at: ${pythonPath}`;
      console.error(`[ERROR] ${error}`);
      reject(new Error(error));
      return;
    }

    // ALWAYS use bundled Python - no fallbacks, no system Python!
    const pythonExe = path.join(process.resourcesPath, 'python', 'python.exe');
    
    console.log(`[DEBUG] Using bundled Python: ${pythonExe}`);
    console.log(`[DEBUG] Python executable exists: ${fs.existsSync(pythonExe)}`);
    
    // If bundled Python doesn't exist, fail immediately
    if (!fs.existsSync(pythonExe)) {
      const error = `Bundled Python not found at: ${pythonExe}`;
      console.error(`[ERROR] ${error}`);
      reject(new Error(error));
      return;
    }

    // Construct command arguments
    const pythonArgs = [pythonPath, command, ...args];
    console.log(`[DEBUG] Full command: ${pythonExe} ${pythonArgs.join(' ')}`);

    // Spawn Python process with bundled Python
    const python = spawn(pythonExe, pythonArgs, {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      const chunk = data.toString();
      console.log(`[PYTHON STDOUT] ${chunk}`);
      output += chunk;
    });

    python.stderr.on('data', (data) => {
      const chunk = data.toString();
      console.log(`[PYTHON STDERR] ${chunk}`);
      error += chunk;
    });

    python.on('close', (code) => {
      console.log(`[DEBUG] Python process exited with code: ${code}`);
      console.log(`[DEBUG] Full output: ${output}`);
      console.log(`[DEBUG] Full error: ${error}`);
      
      if (code === 0) {
        try {
          // Clean the output - remove any debug lines
          const lines = output.trim().split('\n');
          const jsonLine = lines.find(line => {
            try {
              JSON.parse(line);
              return true;
            } catch {
              return false;
            }
          });
          
          if (jsonLine) {
            const result = JSON.parse(jsonLine);
            console.log(`[DEBUG] Parsed result:`, result);
            resolve(result);
          } else {
            // If no JSON found, return raw output
            console.log(`[DEBUG] No JSON found, returning raw output`);
            resolve({ success: true, data: output.trim() });
          }
        } catch (e) {
          console.error(`[ERROR] Failed to parse JSON:`, e);
          console.error(`[ERROR] Raw output was:`, output);
          reject(new Error(`Failed to parse Python response: ${e.message}`));
        }
      } else {
        const errorMsg = error || `Python process exited with code ${code}`;
        console.error(`[ERROR] Python execution failed: ${errorMsg}`);
        reject(new Error(errorMsg));
      }
    });

    python.on('error', (err) => {
      console.error(`[ERROR] Failed to start bundled Python process:`, err);
      reject(new Error(`Failed to start bundled Python process: ${err.message}`));
    });
  });
}

// IPC handlers for vault operations

// Check if vault exists and is initialized
ipcMain.handle('vault-check', async () => {
  try {
    console.log('[IPC] vault-check called');
    const result = await executePythonCommand('check');
    console.log('[IPC] vault-check result:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('[IPC] vault-check error:', error);
    return { success: false, error: error.message };
  }
});

// Initialize new vault
ipcMain.handle('vault-initialize', async (event, masterPassword) => {
  try {
    console.log('[IPC] vault-initialize called');
    const result = await executePythonCommand('init', [masterPassword]);
    console.log('[IPC] vault-initialize result:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('[IPC] vault-initialize error:', error);
    return { success: false, error: error.message };
  }
});

// Unlock vault with master password
ipcMain.handle('vault-unlock', async (event, masterPassword) => {
  try {
    console.log('[IPC] vault-unlock called');
    const result = await executePythonCommand('unlock', [masterPassword]);
    console.log('[IPC] vault-unlock result:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('[IPC] vault-unlock error:', error);
    return { success: false, error: error.message };
  }
});

// Lock vault
ipcMain.handle('vault-lock', async () => {
  try {
    console.log('[IPC] vault-lock called');
    const result = await executePythonCommand('lock');
    console.log('[IPC] vault-lock result:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('[IPC] vault-lock error:', error);
    return { success: false, error: error.message };
  }
});

// List all entries
ipcMain.handle('vault-list-entries', async () => {
  try {
    console.log('[IPC] vault-list-entries called');
    const result = await executePythonCommand('list');
    console.log('[IPC] vault-list-entries result:', result);
    
    // Handle both array response and object response
    if (Array.isArray(result)) {
      return { success: true, data: result };
    } else if (result.success === false) {
      return result;
    } else {
      return { success: true, data: result.data || [] };
    }
  } catch (error) {
    console.error('[IPC] vault-list-entries error:', error);
    return { success: false, error: error.message };
  }
});

// Add new entry
ipcMain.handle('vault-add-entry', async (event, entryData) => {
  try {
    console.log('[IPC] vault-add-entry called with:', entryData);
    const result = await executePythonCommand('add', [
      entryData.name,
      entryData.type,
      JSON.stringify(entryData.data),
      entryData.category,
      entryData.description
    ]);
    console.log('[IPC] vault-add-entry result:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('[IPC] vault-add-entry error:', error);
    return { success: false, error: error.message };
  }
});

// Get entry data (for copying)
ipcMain.handle('vault-get-entry', async (event, entryId, field = null) => {
  try {
    console.log('[IPC] vault-get-entry called with:', entryId, field);
    const args = field ? [entryId, field] : [entryId];
    const result = await executePythonCommand('get', args);
    console.log('[IPC] vault-get-entry result:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('[IPC] vault-get-entry error:', error);
    return { success: false, error: error.message };
  }
});

// Update entry
ipcMain.handle('vault-update-entry', async (event, entryId, entryData) => {
  try {
    console.log('[IPC] vault-update-entry called with:', entryId, entryData);
    const result = await executePythonCommand('update', [
      entryId,
      entryData.name,
      entryData.type,
      JSON.stringify(entryData.data),
      entryData.category,
      entryData.description
    ]);
    console.log('[IPC] vault-update-entry result:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('[IPC] vault-update-entry error:', error);
    return { success: false, error: error.message };
  }
});

// Delete entry
ipcMain.handle('vault-delete-entry', async (event, entryId) => {
  try {
    console.log('[IPC] vault-delete-entry called with:', entryId);
    const result = await executePythonCommand('delete', [entryId]);
    console.log('[IPC] vault-delete-entry result:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('[IPC] vault-delete-entry error:', error);
    return { success: false, error: error.message };
  }
});

// Handle app closing
app.on('before-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
  }
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  if (pythonProcess) {
    pythonProcess.kill();
  }
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});