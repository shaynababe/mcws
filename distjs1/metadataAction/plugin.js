import MetadataAction from './metadataAction.js';
import '../vue.runtime.esm-15b08281.js';

function plugin () {
    return function install(openmct) {
        openmct.actions.register(new MetadataAction(openmct));
    };
}

export { plugin as default };
