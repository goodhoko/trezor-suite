/**
 * Window events handler (for custom navbar)
 */
import { app, ipcMain, BrowserWindow } from 'electron';

const notifyWindowMaximized = (window: BrowserWindow) => {
    window.webContents.send(
        'window/is-maximized',
        process.platform === 'darwin' ? window.isFullScreen() : window.isMaximized(),
    );
};

// notify client with window active state
const notifyWindowActive = (window: BrowserWindow, state: boolean) => {
    window.webContents.send('window/is-active', state);
};

const init = ({ mainWindow, store, logger }: Dependencies) => {
    if (process.platform === 'darwin') {
        // macOS specific window behavior
        // it is common for applications and their context menu to stay active until the user quits explicitly
        // with Cmd + Q or right-click > Quit from the context menu.

        // restore window after click on the Dock icon
        app.on('activate', () => mainWindow.show());
        // hide window to the Dock
        // this event listener will be removed by app.on('before-quit')
        mainWindow.on('close', event => {
            if (global.quitOnWindowClose) {
                app.quit();
                return;
            }

            event.preventDefault();
            mainWindow.hide();
        });
    } else {
        // other platform just kills the app
        app.on('window-all-closed', () => app.quit());
    }

    mainWindow.on('page-title-updated', evt => {
        // prevent updating window title
        evt.preventDefault();
    });
    mainWindow.on('maximize', () => {
        notifyWindowMaximized(mainWindow);
    });
    mainWindow.on('unmaximize', () => {
        notifyWindowMaximized(mainWindow);
    });
    mainWindow.on('enter-full-screen', () => {
        notifyWindowMaximized(mainWindow);
    });
    mainWindow.on('leave-full-screen', () => {
        notifyWindowMaximized(mainWindow);
    });
    mainWindow.on('moved', () => {
        notifyWindowMaximized(mainWindow);
    });
    mainWindow.on('focus', () => {
        notifyWindowActive(mainWindow, true);
    });
    mainWindow.on('blur', () => {
        notifyWindowActive(mainWindow, false);
    });

    ipcMain.on('window/close', () => {
        // Keeping the devtools open might prevent the app from closing
        if (mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.webContents.closeDevTools();
        }
        // store window bounds on close btn click
        const winBound = mainWindow.getBounds() as WinBounds;
        store.setWinBounds(winBound);
        mainWindow.close();
    });
    ipcMain.on('window/minimize', () => {
        mainWindow.minimize();
    });
    ipcMain.on('window/maximize', () => {
        if (process.platform === 'darwin') {
            mainWindow.setFullScreen(true);
        } else {
            mainWindow.maximize();
        }
    });
    ipcMain.on('window/unmaximize', () => {
        if (process.platform === 'darwin') {
            mainWindow.setFullScreen(false);
        } else {
            mainWindow.unmaximize();
        }
    });
    ipcMain.on('client/ready', () => {
        notifyWindowMaximized(mainWindow);
    });
    ipcMain.on('window/focus', () => {
        app.focus({ steal: true });
    });

    app.on('before-quit', () => {
        // store window bounds on cmd/ctrl+q
        const winBound = mainWindow.getBounds() as WinBounds;
        store.setWinBounds(winBound);
    });
};

export default init;
