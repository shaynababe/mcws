import FrameEventFilterViewProvider from './FrameEventFilterViewProvider.js';
import './FrameEventFilterTable.js';
import 'openmct.tables.TelemetryTable';
import 'openmct.tables.components.Table';
import '../vue.runtime.esm-15b08281.js';

function FrameEventFilterViewPlugin() {
    return function install(openmct) {
        openmct.objectViews.addProvider(new FrameEventFilterViewProvider(openmct));
    };
}

export { FrameEventFilterViewPlugin as default };
