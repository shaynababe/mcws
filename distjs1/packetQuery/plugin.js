import PacketQueryViewProvider from './PacketQueryViewProvider.js';
import '../vue.runtime.esm-15b08281.js';

function PacketSummaryPlugin() {
    return function install(openmct) {
        openmct.objectViews.addProvider(new PacketQueryViewProvider(openmct));
    };
}

export { PacketSummaryPlugin as default };
