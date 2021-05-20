import { dialog } from 'electron';
import { createWindow } from './window';

export function openFile() {
    const filePath = dialog.showOpenDialogSync({
        title: 'Open file...',
        properties: ['openFile'],
        securityScopedBookmarks: true,
    });

    if (!filePath) {
        return;
    }

    console.log(filePath);
    // documents.pop();
    // documents.push(filePath.pop());
    // win.setTitle(`${documents[0].split('/').pop()}`);
    // const file = fs.readFileSync(documents[0]);
    // win.webContents.send('open', file.toString());
}

export function showInitialDialog() {
    const iBtn = dialog.showMessageBoxSync({
        title: 'Live Todo',
        message: 'Welcome to Live Todo, open a previous saved file or start a new list',
        type: 'question',
        buttons: ['Close', 'Start new List', 'Open file...'],
        defaultId: 1,
    });

    if (iBtn === 0) {
        return;
    }

    if (iBtn === 2) {
        openFile();
        return;
    }

    createWindow();
}