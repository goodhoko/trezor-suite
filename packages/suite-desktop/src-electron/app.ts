import path from 'path';
import url from 'url';
import { app, BrowserWindow, ipcMain } from 'electron';
import isDev from 'electron-is-dev';

// Libs
import { RESOURCES, PROTOCOL } from '@lib/constants';
import * as store from '@lib/store';
import { MIN_HEIGHT, MIN_WIDTH } from '@lib/screen';
import Logger, { LogLevel } from '@lib/logger';
import { buildInfo, computerInfo } from '@lib/info';

// Modules
import modules from '@module/index';

let mainWindow: BrowserWindow;
const APP_NAME = 'Trezor Suite';
const src = isDev
    ? 'http://localhost:8000/'
    : url.format({
          pathname: 'index.html',
          protocol: PROTOCOL,
          slashes: true,
      });

// Logger
const log = {
    level: app.commandLine.getSwitchValue('log-level') || (isDev ? 'debug' : 'error'),
    writeToConsole: !app.commandLine.hasSwitch('log-no-print'),
    writeToDisk: app.commandLine.hasSwitch('log-write'),
    outputFile: app.commandLine.getSwitchValue('log-output'),
};

const logger = new Logger(log.level as LogLevel, { ...log });
logger.info('Main', 'Application starting.');

// Globals
global.quitOnWindowClose = false;

const init = async () => {
    buildInfo();
    await computerInfo();

    const winBounds = store.getWinBounds();
    logger.debug('Init', `Create Browswer Window (${winBounds.width}x${winBounds.height})`);
    mainWindow = new BrowserWindow({
        title: APP_NAME,
        width: winBounds.width,
        height: winBounds.height,
        frame: false,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        webPreferences: {
            webSecurity: !isDev,
            nativeWindowOpen: true,
            allowRunningInsecureContent: isDev,
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(RESOURCES, 'images', 'icons', '512x512.png'),
    });

    // Load page
    logger.debug('Init', `Load URL (${src})`);
    mainWindow.loadURL(src);

    // Modules
    await modules({
        logger,
        mainWindow,
        src,
        store,
    });
};

app.name = APP_NAME; // overrides @trezor/suite-desktop app name in menu
app.on('ready', init);

app.on('before-quit', () => {
    if (!mainWindow) return;
    mainWindow.removeAllListeners();
    logger.exit();
});

ipcMain.on('app/restart', () => {
    app.relaunch();
    app.exit();
});
