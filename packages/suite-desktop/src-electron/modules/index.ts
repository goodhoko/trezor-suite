import isDev from 'electron-is-dev';

// Modules
import csp from '@module/csp';
import autoUpdater from '@module/auto-updater';
import windowControls from '@module/window-controls';
import tor from '@module/tor';
import bridge from '@module/bridge';
import metadata from '@module/metadata';
import menu from '@module/menu';
import shortcuts from '@module/shortcuts';
import devTools from '@module/dev-tools';
import httpReceiver from '@module/http-receiver';
import requestFilter from '@module/request-filter';
import externalLinks from '@module/external-links';
import fileProtocol from '@module/file-protocol';

const moduleList = [
    { name: 'menu', dependencies: ['mainWindow'], init: menu },
    { name: 'shortcuts', dependencies: ['mainWindow', 'src'], init: shortcuts },
    { name: 'requestFilter', dependencies: ['mainWindow'], init: requestFilter },
    {
        name: 'externalLinks',
        dependencies: ['mainWindow', 'store'],
        init: externalLinks,
    },
    {
        name: 'windowControls',
        dependencies: ['mainWindow', 'store'],
        init: windowControls,
    },
    { name: 'httpReceiver', dependencies: ['mainWindow', 'src'], init: httpReceiver },
    { name: 'metadata', dependencies: [], init: metadata },
    { name: 'bridge', dependencies: [], init: bridge },
    { name: 'tor', dependencies: ['mainWindow', 'store'], init: tor },
    { name: 'devTools', dependencies: ['mainWindow'], init: devTools, isDev: true },
    { name: 'csp', dependencies: ['mainWindow'], init: csp, isDev: false },
    { name: 'fileProtocol', dependencies: ['mainWindow', 'src'], init: fileProtocol, isDev: false },
    { name: 'autoUpdater', dependencies: ['mainWindow', 'store'], init: autoUpdater, isDev: false },
];

const modules = async (dependencies: Dependencies) => {
    const { logger } = dependencies;

    logger.info('Modules', `Loading ${moduleList.length} modules`);

    await Promise.all(
        moduleList.flatMap(module => {
            if (module.isDev !== undefined && module.isDev !== isDev) {
                logger.debug(
                    'Modules',
                    `${module.name} was skipped because it is configured for a diferent environment`,
                );
                return [];
            }

            const deps: { [name in keyof Dependencies]: any } = {
                logger,
            };

            module.dependencies.forEach((dep: keyof Dependencies) => {
                if (dependencies[dep] === undefined) {
                    logger.error(
                        'Modules',
                        `Dependency ${dep} is missing for module ${module.name}`,
                    );
                    throw new Error(); // TODO
                }
                deps[dep] = dependencies[dep];
            });

            return [module.init(deps)];
        }),
    );

    logger.info('Modules', 'All modules loaded');
};

export default modules;
