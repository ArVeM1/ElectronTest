const {app, BrowserWindow} = require('electron');
const path = require("path");
const { autoUpdater } = require('electron-updater');

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 300,
        height: 400,
    });
    console.log('start')
    win.loadFile(path.join(__dirname, 'index.html'));
}

app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdates();
})

autoUpdater.on('update-available', function() {
    console.log('updating')
    // dialog.showMessageBox({
    //     type: 'info',
    //     message: 'Доступно новое обновление. Загружаем...'
    // });
});

// Обработка события завершения загрузки обновления
autoUpdater.on('update-downloaded', function() {
    autoUpdater.quitAndInstall();
});

// Обработка ошибок обновления
autoUpdater.on('error', function(err) {
    console.error('Ошибка обновления:', err.message);
});