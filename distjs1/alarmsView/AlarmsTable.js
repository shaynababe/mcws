import { l as lodashExports } from '../lodash-3c3e13ab.js';
import TelemetryTable from 'openmct.tables.TelemetryTable';
import AlarmsViewHistoricalContextTableRow from './AlarmsViewHistoricalContextTableRow.js';
import Types from 'types/types';
import '../_commonjsHelpers-76cdd49e.js';
import 'openmct.tables.TelemetryTableRow';
import 'services/dataset/DatasetCache';

class AlarmsTable extends TelemetryTable {
    constructor(domainObject, openmct){
        super(domainObject, openmct);

        this.channelType = Types.typeForKey('vista.channel');
    }
    initialize() {
        if (this.domainObject.type === 'vista.alarmMessageStream') {
            this.addTelemetryObject(this.domainObject);
        } else {
            this.filterObserver = this.openmct.objects.observe(this.domainObject, 'configuration.filters', this.updateFilters);
            this.filters = this.domainObject.configuration && this.domainObject.configuration.filters;
            this.loadComposition(this.domainObject);
        }
    }

    getTelemetryProcessor(keyString, columnMap, limitEvaluator) {
        return (telemetry) => {
            //Check that telemetry object has not been removed since telemetry was requested.
            if (!this.telemetryObjects[keyString]) {
                return;
            }

            let telemetryRows = telemetry.map(datum => {
                return new AlarmsViewHistoricalContextTableRow(datum, columnMap, keyString, limitEvaluator, this.channelType)
            });

            if (this.paused) {
                this.delayedActions.push(this.tableRows.addRows.bind(this, telemetryRows, 'add'));
            } else {
                this.tableRows.addRows(telemetryRows, 'add');
            }

            if (this.autoClearTimeoutMS) {
                this.clearCompleted(this.autoClearTimeoutMS);
            }
        };
    }

    processRealtimeDatum(datum, columnMap, keyString, limitEvaluator) {
        this.tableRows.add(new AlarmsViewHistoricalContextTableRow(datum, columnMap, keyString, limitEvaluator, this.channelType));
    }

    createTableRowCollections() {
        this.tableRows = new AlarmsViewRowCollection(this.openmct);

        this.autoClearTimeoutObserver = this.openmct.objects.observe(this.domainObject, 
            'configuration.autoClearTimeout', this.tableRows.setAutoClearTimeout);

        let autoClearTimeout = lodashExports.get(this.domainObject, 'configuration.autoClearTimeout');
        this.tableRows.setAutoClearTimeout(autoClearTimeout);
    }

    clearOutOfAlarmRows(){
        this.tableRows.clearOutOfAlarmRows();
    }

    requestDataFor() {
        return Promise.resolve([]);
    }

    destroy() {
        super.destroy();
        if (this.autoClearTimeoutObserver) {
            this.autoClearTimeoutObserver();
        }
    }
}

export { AlarmsTable as default };
