/**
 * Adds a CSP (Content Security Policy) header to all requests
 */

import { app, dialog, session } from 'electron';

import * as config from '../config';

const disableCspFlag = app.commandLine.hasSwitch('disable-csp');

const init = ({ mainWindow, logger }: Dependencies) => {
    if (disableCspFlag) {
        dialog.showMessageBox(mainWindow, {
            type: 'warning',
            message:
                'The application is running with CSP disabled. This is a security risk! If this is not intentional, please close the application immediately.',
            buttons: ['OK'],
        });
    } else {
        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            callback({
                responseHeaders: {
                    'Content-Security-Policy': [config.cspRules.join(';')],
                    ...details.responseHeaders,
                },
            });
        });
    }
};

export default init;
