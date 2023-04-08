import importFromJSONModifier from './preventImportIntoDatasetModifier.js';
import importWithDatasetsModifier from './ImportExportWithDatasets/importWithDatasetsModifier.js';
import '../vue.runtime.esm-15b08281.js';
import 'services/dataset/DatasetCache';

function ImportExportWithDatasetsPlugin() {
    return function install(openmct) {
        openmct.on('start', () => {
            importFromJSONModifier(openmct);
            importWithDatasetsModifier(openmct);
        });
    }
}

export { ImportExportWithDatasetsPlugin as default };
