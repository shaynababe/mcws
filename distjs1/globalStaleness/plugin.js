import GlobalStaleness from './globalStaleness.js';
import SessionService from 'services/session/SessionService';

function plugin (globalStalenessMs) {
    return function install(openmct) {
        let globalStalenessInstance;

        if (globalStalenessMs) {
            globalStalenessInstance = new GlobalStaleness(globalStalenessMs);

            openmct.on('start', () => {
                const sessionService = SessionService();
                sessionService.listen((session) => {
                    if (!session) {
                        globalStalenessInstance.resetTimestamp();
                    }
                });
            });
        }

        openmct.legacyExtension('services', {
            key: 'vista.staleness',
            implementation: () => {
                return globalStalenessInstance;
            }
        });
    };
}

export { plugin as default };
