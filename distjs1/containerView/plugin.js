import FolderGridView from './FolderGridViewProvider.js';
import FolderListView from './FolderListViewProvider.js';
import BlankGridView from './BlankViewProvider.js';
import 'openmct.views.FolderGridViewComponent';
import '../vue.runtime.esm-15b08281.js';
import 'openmct.views.FolderListViewComponent';

const FOLDER_CONTAINER_TYPES = [
    'vista.dictionarySource',
];

const BLANK_CONTAINER_TYPES = [
    'vista.dataset',
    'vista.channel.alarms',
    'vista.channelSource',
    'vista.channelGroup',
    'vista.headerChannelSource',
];

/**
 * Adds the folder views to container type objects without defined views/telemetry.
*/
function ContainerViewPlugin() {
    return function install(openmct) {
        openmct.objectViews.addProvider(new FolderGridView(openmct, FOLDER_CONTAINER_TYPES));
        openmct.objectViews.addProvider(new FolderListView(openmct, FOLDER_CONTAINER_TYPES));
        openmct.objectViews.addProvider(new BlankGridView(openmct, BLANK_CONTAINER_TYPES));
    }
}

export { ContainerViewPlugin as default };
