const {app, BrowserWindow, dialog} = require('electron');
const path = require("path");
const { autoUpdater } = require('electron-updater');
const log = require('electron-log')
const ProgressBar = require("electron-progressbar");

log.transports.file.resolvePath = () => path.join("C:\\Users\\Amir\\Desktop\\JsProject\\testElectron", 'logs/main.log');
log.info("asdasdasd")

let win;
let progressBar;
function createWindow() {
    win = new BrowserWindow({
        width: 300,
        height: 400,
    });
    win.loadFile(path.join(__dirname, 'index.html'));
}

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}

console.log(app.getVersion());

app.on('ready', () => {
    autoUpdater.checkForUpdates();
    log.info(`Current version ${app.getVersion()}`)
    createWindow();
})

autoUpdater.on('update-available', function(_event, releaseNotes, releaseName) {
    const dialogOpts = {
        type: "info",
        buttons: ["OK"],
        title: "Application Update",
        message: releaseNotes,
        detail: "A new version is being downloaded"
    }
    dialog.showMessageBox(dialogOpts, (res) => {

    })
    log.info('Нашел обновление')
});

autoUpdater.on('update-available', function(_event, releaseNotes, releaseName) {
    log.info(JSON.stringify(releaseNotes))
    log.info(releaseName)
    const dialogOpts = {
        type: "info",
        buttons: [],
        title: "Загрузка",
        message: "Идет обновление...",
        detail: "В данный момент обновление загружается"
    }
    dialog.showMessageBox(dialogOpts, (res) => {

    })
    log.info('updating...')
    progressBar = new ProgressBar({
        text: 'Preparing data...',
        detail: 'Wait...'
    });
    progressBar
        .on('completed', function() {
            console.info(`completed...`);
            progressBar.detail = 'Task completed. Exiting...';
        })
        .on('aborted', function() {
            console.info(`aborted...`);
        });
});
// autoUpdater.on('download-progress', (ev, progressObj) => {
//     let log_message = "Downloaded " + progressObj.percent + "%";
//     console.log(log_message);
//
//     dialog.updateProgressBar(progressObj.percent / 100);
// })

autoUpdater.on('update-downloaded', function(_event, releaseNotes, releaseName) {
    progressBar.setCompleted();
    const dialogOpts = {
        type: "info",
        buttons: ["Restart"],
        title: "Application Update",
        message: "releaseNotes",
        detail: "A new version has been downloaded. Restart the application to apply the updates"
    }
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall();
    })
    log.info(`updated downloaded. Last version ${app.getVersion()}`)
});

autoUpdater.on('update-not-available', function(_event, releaseNotes, releaseName) {
    const dialogOpts = {
        type: "info",
        buttons: [],
        title: "Обновлений нет",
        message: "Обновлений нет123",
        detail: "В данный момент обновлений нету"
    }
    dialog.showMessageBox(dialogOpts, (res) => {

    })
    log.info('Not new version')
});

// Обработка события завершения загрузки обновления


// Обработка ошибок обновления
autoUpdater.on('error', function(err) {
    const dialogOpts = {
        type: "info",
        buttons: [],
        title: "Ошибка",
        message: "Ошибка при обновлении",
        detail: "Обратитесь в тех-поддержку"
    }
    dialog.showMessageBox(dialogOpts, (res) => {

    })
    log.error('Error: ', err)
});