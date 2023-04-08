import { CHANNEL_TABLE_SET_KEY, CHANNEL_TABLE_SET_NAME, CHANNEL_TABLE_SET_ICON } from '../constants.js';
import ChannelTableSetViewProvider from './ChannelTableSetViewProvider.js';
import channelTableSetCompositionPolicy from './ChannelTableSetCompositionPolicy.js';
import './ChannelTableSetView.js';
import '../../vue.runtime.esm-15b08281.js';

function ChannelTableSetPlugin() {
    return function install(openmct) {

        openmct.objectViews.addProvider(new ChannelTableSetViewProvider(openmct));

        openmct.types.addType(CHANNEL_TABLE_SET_KEY, {
            name: CHANNEL_TABLE_SET_NAME,
            creatable: true,
            description: 'Combine multiple Channel Tables into a single tabular view. Each group has a header with its name. Can be added to Display Layouts.',
            cssClass: CHANNEL_TABLE_SET_ICON,
            initialize(domainObject) {
                domainObject.composition = [];
            }
        });

        openmct.composition.addPolicy(channelTableSetCompositionPolicy());
    };
}

export { ChannelTableSetPlugin as default };
