import { app } from 'electron';
import electronLocalshortcut from 'electron-localshortcut';

const init = ({ mainWindow, src, logger }: Dependencies) => {
    electronLocalshortcut.register(mainWindow, 'CommandOrControl+Alt+I', () => {
        mainWindow.webContents.openDevTools();
    });

    electronLocalshortcut.register(mainWindow, 'F5', () => {
        mainWindow.loadURL(src);
    });

    electronLocalshortcut.register(mainWindow, 'CommandOrControl+R', () => {
        mainWindow.loadURL(src);
    });

    app.on('before-quit', () => {
        electronLocalshortcut.unregisterAll(mainWindow);
    });
};

export default init;
