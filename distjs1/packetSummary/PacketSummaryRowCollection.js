import TableRowCollection from 'openmct.tables.collections.TableRowCollection';
import { l as lodashExports } from '../lodash-3c3e13ab.js';
import '../_commonjsHelpers-76cdd49e.js';

class PacketSummaryRowCollection extends TableRowCollection {
    constructor(openmct) {
        super(openmct);

        this.createRowMapEntries = this.createRowMapEntries.bind(this);
        this.removeRowMapEntries = this.removeRowMapEntries.bind(this);
        this.rowMap = {};

        this.on('remove', this.removeRowMapEntries);
        this.on('add', this.createRowMapEntries);
    }

    createRowMapEntries(row) {
        if (Array.isArray(row)) {
            row.forEach(rowEntry => this.createRowMapEntries(rowEntry));
        } else {
            this.rowMap[row.rowId] = row;
        }
    }

    removeRowMapEntries(rows) {
        let rowId;
        rows.forEach((row) => {
            rowId = row.datum.id;
            delete this.rowMap[rowId];
        });
    }

    createRowId(datum) {
        return lodashExports.padStart(datum.vcid, 3, 0) + '/' + lodashExports.padStart(datum.apid, 4, 0);
    }

    contains(rowId) {
        return this.rowMap[rowId] !== undefined;
    }

    addOrUpdateRow(row) {
        if (this.contains(row.rowId)) {
            this.removeRow(row);
        }

        this.add(row);
    }

    add(row) {
        super.addRows([row], 'add');
    }

    removeRow(row) {
        this.rows = this.rows.filter(removeRow => removeRow.rowId !== row.rowId);

        this.emit('remove', [row]);
    }

    destroy() {
        super.destroy();
        this.off('remove', this.removeRowMapEntries);
        this.off('add', this.createRowMapEntries);
    }
    
}

export { PacketSummaryRowCollection as default };
