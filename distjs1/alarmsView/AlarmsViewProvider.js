import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import TableComponent from 'openmct.tables.components.Table';
import AlarmsTable from './AlarmsTable.js';
import '../lodash-3c3e13ab.js';
import '../_commonjsHelpers-76cdd49e.js';
import 'openmct.tables.TelemetryTable';
import './AlarmsViewHistoricalContextTableRow.js';
import 'openmct.tables.TelemetryTableRow';
import 'services/dataset/DatasetCache';
import 'types/types';

class AlarmsViewProvider {
    constructor(openmct) {
        this.openmct = openmct;

        this.key = 'vista.alarmsView';
        this.name = 'Alarms Table';
        this.cssClass = 'icon-tabular-lad';
    }

    canView(domainObject) {
        return domainObject.type === "vista.alarmsView" || domainObject.type === "vista.alarmMessageStream";
    }

    view(domainObject, objectPath) {
        let table = new AlarmsTable(domainObject, openmct);
        let component;
        let markingProp = {
            enable: true,
            useAlternateControlBar: false,
            rowName: '',
            rowNamePlural: ''
        };
        const view = {
            show: function (element, editMode) {
                component = new Vue({
                    el: element,
                    components: {
                        TableComponent
                    },
                    data() {
                        return {
                            isEditing: editMode,
                            markingProp,
                            view
                        };
                    },
                    provide: {
                        openmct,
                        table,
                        objectPath,
                        currentView: view
                    },
                    template:
                        `<table-component 
                            ref="tableComponent"
                            :allowSorting="true"
                            :isEditing="isEditing" 
                            :marking="markingProp"
                            :view="view"
                        />`
                });
            },
            onEditModeChange(editMode) {
                component.isEditing = editMode;
            },
            onClearData() {
                table.clearData();
            },
            getViewContext() {
                if (component) {
                    let context = component.$refs.tableComponent.getViewContext();

                    context['vista.alarmsView'] = true;
                    context.clearOutOfAlarmRows = () => {
                        table.clearOutOfAlarmRows();
                    };

                    return context;
                } else {
                    return {
                        type: 'telemetry-table',
                        'vista.alarmsView': true
                    };
                }
            },
            destroy: function (element) {
                component.$destroy();
                component = undefined;
            }
        };

        return view;
    }
     
    canEdit(domainObject) {
        return domainObject.type === "vista.alarmsView";
    }
}

export { AlarmsViewProvider as default };
