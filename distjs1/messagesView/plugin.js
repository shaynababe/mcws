import MessagesViewProvider from './MessagesViewProvider.js';
import './MessagesTable.js';
import 'openmct.tables.TelemetryTable';
import 'openmct.tables.components.Table';
import '../vue.runtime.esm-15b08281.js';

//import VistaTableConfigurationProvider from '../tables/VistaTableConfigurationProvider.js';

function MessagesViewPlugin(options) {
    return function install(openmct) {
        openmct.objectViews.addProvider(new MessagesViewProvider(openmct));
        openmct.types.addType('vista.messagesView', {
            name: "Messages View",
            description: "Drag and drop a message node into this view to show a filterable table of messages",
            cssClass: "icon-tabular-lad",
            creatable: true,
            initialize(domainObject) {
                domainObject.composition = [];
                domainObject.configuration = {
                    filters: {}
                };
            }
        });
        openmct.inspectorViews.addProvider(
            new VistaTableConfigurationProvider(
                'vista.messages-view-configuration', 
                'Messages View Configuration',
                'vista.messagesView'
            )
        );

        openmct.composition.addPolicy((parent, child) => {
            if (parent.type === 'vista.messagesView') {
                return child.type === 'vista.message'
            }
            return true;
        });
    }
}

export { MessagesViewPlugin as default };
