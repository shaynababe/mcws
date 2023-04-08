import EVRViewProvider from './EVRViewProvider.js';
import EVRViewLevelsConfigurationViewProvider from './EVRViewLevelsConfigurationViewProvider.js';
import './EVRTable.js';
import 'openmct.tables.TelemetryTable';
import './EVRLevelIndicatorTableRow.js';
import 'openmct.tables.TelemetryTableRow';
import 'openmct.tables.components.Table';
import '../vue.runtime.esm-15b08281.js';

//import VistaTableConfigurationProvider from '../tables/VistaTableConfigurationProvider';

function EVRViewPlugin(options) {
    return function install(openmct) {
        openmct.objectViews.addProvider(new EVRViewProvider(openmct));

        openmct.types.addType('vista.evrView', {
            name: "EVR View",
            description: "Drag and drop EVR node(s) and/or EVR module(s) to show Event Records.",
            cssClass: "icon-tabular-realtime",
            creatable: true,
            initialize(domainObject) {
                domainObject.composition = [];
                domainObject.configuration = {
                    filters: {}
                };
            }
        });

        openmct.inspectorViews.addProvider(
            new EVRViewLevelsConfigurationViewProvider(options)
        );

        openmct.inspectorViews.addProvider(
            new VistaTableConfigurationProvider(
                'vista.evr-view-configuration', 
                'EVR View Configuration',
                'vista.evrView'
            )
        );

        openmct.composition.addPolicy((parent, child) => {
            if (parent.type === 'vista.evrView') {
                return child.type === 'vista.evr'
                    || child.type === 'vista.evrModule'
                    || child.type === 'vista.evrSource';
            }

            return true;
        });
    }
}

export { EVRViewPlugin as default };
