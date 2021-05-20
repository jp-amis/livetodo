import fs from 'fs';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

const windows = {};

export async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 640,
        minHeight: 348,
        show: false,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            preload: path.join(__static, 'preload.js'),
        },
    });

    const winId = win.id;

    windows[win.id] = {
        win,
        file: null,
        serialized: '',
    };

    win.once('ready-to-show', () => {
        win.webContents.send('open', { winId: win.id, serialized: '' });
    });

    // win.on('close', (e) => {
    //
    // });

    win.once('closed', () => {
        windows[winId] = null;
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        // if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
}

export async function onSave(menuItem, win) {
    if (!win) {
        return;
    }

    const state = windows[win.id];
    if (!state.file) {
        const saveFile = dialog.showSaveDialogSync(win, {});
        if (!saveFile) {
            return;
        }

        state.file = saveFile;
    }

    fs.writeFileSync(state.file, state.serialized);
}

ipcMain.on('win-ready', (evt, args) => {
    windows[args.winId].win.show();
});

ipcMain.on('file-changed', (evt, args) => {
    windows[args.winId].serialized = args.serialized;
});