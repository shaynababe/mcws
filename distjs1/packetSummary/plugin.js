import ProductSummaryViewProvider from './PacketSummaryViewProvider.js';
import '../vue.runtime.esm-15b08281.js';
import './PacketSummaryTable.js';
import 'openmct.tables.TelemetryTable';
import './PacketSummaryRowCollection.js';
import 'openmct.tables.collections.TableRowCollection';
import '../lodash-3c3e13ab.js';
import '../_commonjsHelpers-76cdd49e.js';
import './PacketSummaryRow.js';
import 'openmct.tables.TelemetryTableRow';
import 'openmct.tables.components.Table';

//import VistaTableConfigurationProvider from '../tables/VistaTableConfigurationProvider.js';

function PacketSummaryPlugin() {
    return function install(openmct) {
        openmct.types.addType('vista.packetSummaryView', {
            name: "Packet Summary View",
            description: "Drag and drop a packet summary events node into this view",
            cssClass: "icon-tabular-lad",
            creatable: true,
            initialize(domainObject) {
                domainObject.composition = [];
                domainObject.configuration = {};
            }
        });

        openmct.objectViews.addProvider(new ProductSummaryViewProvider(openmct));

        const wrappedGet = openmct.objectViews.get;
        openmct.objectViews.get = function (domainObject) {
            return wrappedGet.apply(this, arguments).filter(viewProvider =>
                !(domainObject.type === 'vista.packetSummaryEvents' && viewProvider.key === 'table')
            );
        };

        openmct.composition.addPolicy((parent, child) => {
            if (parent.type === 'vista.packetSummaryView') {
                return child.type === 'vista.packetSummaryEvents';
            }
            return true;
        });

        openmct.inspectorViews.addProvider(new VistaTableConfigurationProvider(
            'vista.packet-summary-configuration', 
            'Packet Summary View Configuration',
            'vista.packetSummaryView'
        ));
    }
}

export { PacketSummaryPlugin as default };
