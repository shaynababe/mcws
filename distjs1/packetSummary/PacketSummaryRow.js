import TelemetryTableRow from 'openmct.tables.TelemetryTableRow';

class PacketSummaryRow extends TelemetryTableRow {
    constructor(datum, columns, objectKeyString, limitEvaluator, rowId) {
        super(datum, columns, objectKeyString, limitEvaluator);

        this.rowId = rowId;
    }

    update(incomingDatum) {
        this.datum = incomingDatum;
    }
}

export { PacketSummaryRow as default };
