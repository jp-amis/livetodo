import { Menu, MenuItem } from 'electron';
import { createWindow, onSave } from './window';

export function initMenu() {
    const menu = new Menu();
    menu.append(new MenuItem({
        label: 'Live Todo',
    }));
    menu.append(new MenuItem({
        label: 'File',
        submenu: [
            {
                label: 'New',
                accelerator: 'CommandOrControl+N',
                click: createWindow,
            },
            {
                label: 'Open',
                accelerator: 'CommandOrControl+O',
                // click: openFile,
            },
            {
                type: 'separator',
            },
            {
                label: 'Close',
                accelerator: 'CommandOrControl+W',
                role: 'close',
            },
            {
                label: 'Save',
                accelerator: 'CommandOrControl+S',
                click: onSave,
            },
            {
                label: 'Save As...',
                accelerator: 'CommandOrControl+Shift+S',
                // click: openFile,
            },
        ],
    }));

    Menu.setApplicationMenu(menu);
}