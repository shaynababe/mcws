import TelemetryTableConfiguration from 'openmct.tables.TelemetryTableConfiguration';
import { config } from './config.js';
import '../_commonjsHelpers-76cdd49e.js';

//import FrameWatchColumn from './FrameWatchColumn';

class FrameWatchTableConfiguration extends TelemetryTableConfiguration {
    constructor(domainObject, openmct, type) {
        super(domainObject, openmct);

        this.config = config[type];
        this.columns = this.config.columns.map(column => new FrameWatchColumn(column.key, column.title));
    }

    addSingleColumnForObject(telemetryObject, column, position) {
        /**
         * override with no-op
         * we are adding columns manually in table configuration
         * and in table view
         */
    }
}

export { FrameWatchTableConfiguration as default };
