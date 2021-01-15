/**
 * Enable development tools
 */
const init = ({ mainWindow, logger }: Dependencies) => {
    mainWindow.webContents.once('dom-ready', () => {
        logger.debug('DevTools', 'Opening devTools');
        mainWindow.webContents.openDevTools();
    });
};

export default init;
