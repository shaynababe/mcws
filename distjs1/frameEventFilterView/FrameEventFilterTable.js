import TelemetryTable from 'openmct.tables.TelemetryTable';

class FrameEventFilterTable extends TelemetryTable {
    constructor(domainObject, openmct) {
        super(domainObject, openmct);
    }

    requestDataFor() {
        return Promise.resolve([]);
    }
}

export { FrameEventFilterTable as default };
