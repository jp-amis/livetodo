let _delegateOpen = null;

export function setOpenDelegate(delegateOpen) {
    _delegateOpen = delegateOpen;
}

window.ipcRenderer.on('open', (event, arg) => {
    if (_delegateOpen != null) {
        _delegateOpen(arg);
    }
});

export function fileChanged(winId, serialized) {
    window.ipcRenderer.send('file-changed', { winId, serialized });
}

export function setReady(winId) {
    window.ipcRenderer.send('win-ready', { winId });
}