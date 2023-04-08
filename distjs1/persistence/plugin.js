import { createNamespace, createIdentifierFromNamespaceDefinition } from './utils.js';
import MCWSPersistenceProvider from './MCWSPersistenceProvider.js';
import '../services/mcws/mcws.js';
import '../services/mcws/NamespaceMIO.js';
import '../services/mcws/MIO.js';
import '../services/mcws/MCWSParameters.js';
import '../services/mcws/MCWSClient.js';
import '../services/mcws/OpaqueFileMIO.js';
import '../services/mcws/DataTableMIO.js';

function MCWSPersistenceProviderPlugin(configNamespaces) {
    return async function install(openmct) {
        let rootsResolve;
        const rootsPromise = new Promise((resolve, reject) => {
            rootsResolve = resolve;
        });
        openmct.objects.addRoot(() => rootsPromise);

        const mcwsPersistenceProvider = new MCWSPersistenceProvider(openmct, configNamespaces.map(createNamespace));

        // install the provider for each persistence space,
        // key is the namespace in the response for persistence namespaces
        const persistenceNamespaces = await mcwsPersistenceProvider.getPersistenceNamespaces();
        persistenceNamespaces.forEach(({ key }) => openmct.objects.addProvider(key, mcwsPersistenceProvider));

        // add the roots
        const rootNamespaces = await mcwsPersistenceProvider.getRootNamespaces();
        const ROOT_IDENTIFIERS = rootNamespaces.map(createIdentifierFromNamespaceDefinition);

        rootsResolve(ROOT_IDENTIFIERS);
    };
}

export { MCWSPersistenceProviderPlugin as default };
