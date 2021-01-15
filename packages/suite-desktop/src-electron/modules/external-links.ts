/**
 * Opens external links in the default browser (displays a warning when using Tor)
 */
import { shell, dialog } from 'electron';

import * as config from '../config';

const init = ({ mainWindow, store, logger }: Dependencies) => {
    const handleExternalLink = (event: Event, url: string) => {
        if (config.oauthUrls.some(u => url.startsWith(u))) {
            event.preventDefault();
            return shell.openExternal(url);
        }

        if (url !== mainWindow.webContents.getURL()) {
            event.preventDefault();

            const torSettings = store.getTorSettings();
            if (torSettings.running) {
                // TODO: Replace with in-app modal
                const result = dialog.showMessageBoxSync(mainWindow, {
                    type: 'warning',
                    message: `The following URL is going to be opened in your browser\n\n${url}`,
                    buttons: ['Cancel', 'Continue'],
                });
                // Cancel
                if (result === 0) return;
            }
            shell.openExternal(url);
        }
    };

    mainWindow.webContents.on('new-window', handleExternalLink);
    mainWindow.webContents.on('will-navigate', handleExternalLink);
};

export default init;
