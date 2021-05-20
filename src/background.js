'use strict';

import { app, BrowserWindow, protocol } from 'electron';
// import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
// import fs from 'fs';
// import path from 'path';
// import { createWindow } from './electron/main/window';
import { showInitialDialog } from './electron/main/file';
import { initMenu } from './electron/main/menu';
// const { Parser } = require('./helpers/parse');
// const { Menu, MenuItem } = require('electron')

const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } },
]);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        showInitialDialog();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }

    showInitialDialog();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}

//
// // Handle file
// const documents = [];
//
// ipcMain.on('save', (event, arg) => {
//     if (!documents.length) {
//         const savedPath = dialog.showSaveDialogSync(win, {
//             title: 'Save as...',
//             defaultPath: 'Default.ltodo',
//             filters: [
//                 {
//                     name: 'LiveTodo',
//                     extension: ['ltodo'],
//                 },
//             ],
//             securityScopedBookmarks: true,
//         });
//
//         if (!savedPath) {
//             return;
//         }
//
//         documents.push(savedPath);
//     }
//
//     win.setTitle(`${documents[0].split('/').pop()}`);
//     fs.writeFileSync(documents[0], arg.data);
// });
//
// function openFile() {
//     const filePath = dialog.showOpenDialogSync(win, {
//         title: 'Open file...',
//         properties: ['openFile', 'createDirectory']
//     });
//
//     if (!filePath) {
//         return;
//     }
//
//     documents.pop();
//     documents.push(filePath.pop());
//     win.setTitle(`${documents[0].split('/').pop()}`);
//     const file = fs.readFileSync(documents[0]);
//     const parser = new Parser(file.toString());
//     win.webContents.send('open', parser.parse());
// }
//
// const menu = new Menu();
// menu.append(new MenuItem({
//     label: 'LiveTodo',
// }));
// menu.append(new MenuItem({
//     label: 'File',
//     submenu: [{
//         label: 'Open...',
//         accelerator: 'CommandOrControl+O',
//         click: openFile,
//     }]
// }))
//
// Menu.setApplicationMenu(menu)

initMenu();