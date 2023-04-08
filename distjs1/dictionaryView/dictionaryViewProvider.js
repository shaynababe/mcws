import TableComponent from 'openmct.tables.components.Table';
import DictionaryViewTable from './dictionaryViewTable.js';
import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import 'openmct.tables.TelemetryTable';
import 'openmct.tables.TelemetryTableRow';
import 'services/mcws/mcws';

var DictionaryView = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"l-preview-window",class:{loading: _vm.isLoading}},[(_vm.rowsLength)?_c('div',{staticClass:"l-preview-window__object-view l-preview-window__object-view-no-padding"},[_c('telemetry-table',{attrs:{"marking":_vm.markingProp,"enableLegacyToolbar":true}},[_c('div',{staticClass:"c-table-and-summary__summary"},[_c('div',{staticClass:"c-table-and-summary__summary-item"},[_vm._v("\n                        DataTable URL:\n                        "),_c('em',[_vm._v(" "+_vm._s(_vm.url)+" ")])]),_vm._v(" "),_c('div',{staticClass:"c-table-and-summary__summary-item"},[_vm._v("\n                        Returned:\n                        "),_c('em',[_vm._v(_vm._s(_vm.rowsLength)+" rows")])])])])],1):_vm._e(),_vm._v(" "),(_vm.error)?_c('div',{staticClass:"message block error"},[_c('h2',[_vm._v("Error Received From Server:")]),_vm._v(" "),_c('pre',[_c('code',[_vm._v(_vm._s(_vm.error.status)+" : "+_vm._s(_vm.error.statusText))])])]):_vm._e()])},
staticRenderFns: [],
    inject: [
        'openmct',
        'domainObject',
        'table',
        'objectPath',
        'currentView',
    ],
    components: {
        TelemetryTable: TableComponent
    },
    data() {
        return {
            headers: [],
            rows: [],
            rowsLength: undefined,
            isLoading: false,
            url: this.domainObject.dataTablePath,
            markingProp: {
                enable: true,
                useAlternateControlBar: false,
                rowName: "",
                rowNamePlural: ""
            },
            error: undefined
        }
    },
    methods: {
        processData(data) {
            this.populateTable(data);
        },
        processError(errorObject) {
            this.error = {
                statusText: errorObject.statusText,
                status: errorObject.status
            };
            this.isLoading = false;
        },
        populateTable(data) {
            this.headers = this.processHeaders(data[0]);
            this.rows = this.processRows(data);

            this.table.metadata = this.headers;
            this.table.data = this.rows;
            this.isLoading = false;
        },
        processHeaders(row) {
            return Object.keys(row).map((key => {
                return {
                    name: key,
                    key: key,
                    source: key
                }
            }));
        },
        processRows(data) {
           return data;
        }
    },
    mounted() {
        this.isLoading = true;

        this.table.loadDictionary().then(() => {
            this.rowsLength = this.table.tableRows.getRowsLength();
            this.error = this.table.error;
            this.isLoading = false;
        });
    }
};

class DictionaryViewProvider {
    constructor(openmct) {
        this.key = 'dictionary-view';
        this.name = 'Dictionary View';
        this.cssClass = 'icon-dataset';

        this.openmct = openmct;
    }

    canView(domainObject) {
        return domainObject.type === 'vista.dictionary';
    }

    view(domainObject, objectPath) {
        let component;

        let table = new DictionaryViewTable(domainObject, openmct);
        const markingProp = {
            enable: true,
            useAlternateControlBar: false,
            rowName: '',
            rowNamePlural: ''
        };

        const view = {
            show: function (element, editMode) {
                component =  new Vue({
                    el: element,
                    components: {
                        DictionaryView
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
                        domainObject,
                        table,
                        objectPath,
                        currentView: view
                    },
                    template: `
                        <dictionary-view
                            ref="dictionaryView"
                            class="v-dictionary"
                            :isEditing="isEditing"
                            :allowSorting="true"
                            :marking="markingProp"
                            :view="view"
                        >
                            <template v-slot:buttons></template>
                        </dictionary-view>
                    `,
                });
            },
            onEditModeChange(editMode) {
                component.isEditing = editMode;
            },
            onClearData() {
                table.clearData();
            },
            getViewContext() {
                return {};
            },
            destroy: function (element) {
                component.$destroy();
                component = undefined;
            }
        };

        return view;
    }
}

export { DictionaryViewProvider as default };
