import TableRowCollection from 'openmct.tables.collections.TableRowCollection';

class SortedEventsCollection extends TableRowCollection {
    constructor() {
        super();

        this.sortOptions = {
            key: 'event_time',
            direction: 'asc'
        };
    }
    getValueForSortColumn(row) {
        return row[this.sortOptions.key];
    }
}

export { SortedEventsCollection as default };
