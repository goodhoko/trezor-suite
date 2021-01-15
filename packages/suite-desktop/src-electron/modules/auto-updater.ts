/**
 * Auto Updater feature (notify, download, install)
 */

import { app, ipcMain } from 'electron';
import { autoUpdater, CancellationToken } from 'electron-updater';

// Runtime flags
const preReleaseFlag = app.commandLine.hasSwitch('pre-release');

const init = ({ mainWindow, store, logger }: Dependencies) => {
    let isManualCheck = false;
    let latestVersion = {};
    let updateCancellationToken: CancellationToken;
    const updateSettings = store.getUpdateSettings();

    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.allowPrerelease = preReleaseFlag;

    if (updateSettings.skipVersion) {
        mainWindow.webContents.send('update/skip', updateSettings.skipVersion);
    }

    autoUpdater.on('checking-for-update', () => {
        mainWindow.webContents.send('update/checking');
    });

    autoUpdater.on('update-available', ({ version, releaseDate }) => {
        if (updateSettings.skipVersion === version) {
            return;
        }

        latestVersion = { version, releaseDate, isManualCheck };
        mainWindow.webContents.send('update/available', latestVersion);

        // Reset manual check flag
        isManualCheck = false;
    });

    autoUpdater.on('update-not-available', ({ version, releaseDate }) => {
        latestVersion = { version, releaseDate, isManualCheck };
        mainWindow.webContents.send('update/not-available', latestVersion);

        // Reset manual check flag
        isManualCheck = false;
    });

    autoUpdater.on('error', err => {
        mainWindow.webContents.send('update/error', err);
    });

    autoUpdater.on('download-progress', progressObj => {
        mainWindow.webContents.send('update/downloading', { ...progressObj });
    });

    autoUpdater.on('update-downloaded', ({ version, releaseDate, downloadedFile }) => {
        mainWindow.webContents.send('update/downloaded', { version, releaseDate, downloadedFile });
    });

    ipcMain.on('update/check', (_, isManual?: boolean) => {
        if (isManual) {
            isManualCheck = true;
        }

        autoUpdater.checkForUpdates();
    });
    ipcMain.on('update/download', () => {
        mainWindow.webContents.send('update/downloading', {
            percent: 0,
            bytesPerSecond: 0,
            total: 0,
            transferred: 0,
        });
        updateCancellationToken = new CancellationToken();
        autoUpdater.downloadUpdate(updateCancellationToken).catch(() => null); // Suppress error in console
    });
    ipcMain.on('update/install', () => {
        // This will force the closing of the window to quit the app on Mac
        global.quitOnWindowClose = true;
        // https://www.electron.build/auto-update#module_electron-updater.AppUpdater+quitAndInstall
        // appUpdater.quitAndInstall(isSilent, isForceRunAfter)
        // isSilent (windows): Runs the installer in silent mode
        // isForceRunAfter (windows): Run the app after finish even on silent install
        autoUpdater.quitAndInstall(true, true);
    });
    ipcMain.on('update/cancel', () => {
        mainWindow.webContents.send('update/available', latestVersion);
        updateCancellationToken.cancel();
    });
    ipcMain.on('update/skip', (_, version) => {
        mainWindow.webContents.send('update/skip', version);
        updateSettings.skipVersion = version;
        store.setUpdateSettings(updateSettings);
    });
};

export default init;
