const { ipcRenderer } = require('electron');

function file(serialized) {
    ipcRenderer.send('save', {
        data: serialized,
    });
}

module.exports.save = file;

ipcRenderer.on('open', (event, arg) => {
    console.log(arg);
});