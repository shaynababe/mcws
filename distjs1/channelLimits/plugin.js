import ChannelLimitsProvider from './ChannelLimitsProvider.js';

function ChannelLimitsPlugin() {
    return function install(openmct) {
        openmct.telemetry.addProvider(new ChannelLimitsProvider());
    };
}

export { ChannelLimitsPlugin as default };
