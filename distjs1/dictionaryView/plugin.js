import DictionaryViewProvider from './dictionaryViewProvider.js';
import 'openmct.tables.components.Table';
import './dictionaryViewTable.js';
import 'openmct.tables.TelemetryTable';
import 'openmct.tables.TelemetryTableRow';
import 'services/mcws/mcws';
import '../vue.runtime.esm-15b08281.js';

function plugin() {
    return function install(openmct) {
        openmct.objectViews.addProvider(new DictionaryViewProvider(openmct));
    }
}

export { plugin as default };
