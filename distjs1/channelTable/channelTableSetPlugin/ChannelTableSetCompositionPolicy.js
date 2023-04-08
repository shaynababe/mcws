import { CHANNEL_TABLE_SET_KEY, CHANNEL_TABLE_KEY } from '../constants.js';

function channelTableSetCompositionPolicy(openmct) {
    return function (parent, child) {
        if (parent.type === CHANNEL_TABLE_SET_KEY) {
            return child.type === CHANNEL_TABLE_KEY;
        }

        return true;
    };
}

export { channelTableSetCompositionPolicy as default };
