const { ipcRenderer } = require('electron');

// function file(serialized) {
//     ipcRenderer.send('save', {
//         data: serialized,
//     });
// }
//
// module.exports.save = file;
let _delegateOpen = null;

module.exports.setDelegateOpen = (delegateOpen) => {
  _delegateOpen = delegateOpen;
};

ipcRenderer.on('open', (event, arg) => {
    if (_delegateOpen != null) {
        _delegateOpen(arg);
    }
});