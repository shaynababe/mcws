import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import PacketSummaryTable from './PacketSummaryTable.js';
import TableComponent from 'openmct.tables.components.Table';
import 'openmct.tables.TelemetryTable';
import './PacketSummaryRowCollection.js';
import 'openmct.tables.collections.TableRowCollection';
import '../lodash-3c3e13ab.js';
import '../_commonjsHelpers-76cdd49e.js';
import './PacketSummaryRow.js';
import 'openmct.tables.TelemetryTableRow';

var PacketSummaryViewComponent = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-table"},[_c('div',{staticClass:"c-table-summary"},[_c('div',{staticClass:"c-table-and-summary__summary-item"},[_vm._v("FSW Valid Packets: "+_vm._s(_vm.fswValid))]),_vm._v(" "),_c('div',{staticClass:"c-table-and-summary__summary-item"},[_vm._v("FSW Invalid Packets: "+_vm._s(_vm.fswInvalid))]),_vm._v(" "),_c('div',{staticClass:"c-table-and-summary__summary-item"},[_vm._v("FSW Fill Packets: "+_vm._s(_vm.fswFill))])]),_vm._v(" "),_c('div',{staticClass:"v-packet-summary-table"},[_c('table-component',{ref:"tableComponent",attrs:{"allowSorting":true,"isEditing":_vm.isEditing,"marking":_vm.markingProp,"view":_vm.view}})],1)])},
staticRenderFns: [],
    inject: [
        'openmct',
        'table',
        'objectPath'
    ],
    components: {
        TableComponent
    },
    props: {
        isEditing: {
            type: Boolean,
            required: true
        },
        view: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.table.on('update-header', this.updateHeader);
    },
    destroyed() {
        this.table.off('update-header', this.updateHeader);
    },
    data() {
        let markingProp = {
            enable: true,
            useAlternateControlBar: false,
            rowName: '',
            rowNamePlural: ''
        };

        return {
            markingProp,
            fswValid: '--',
            fswInvalid: '--',
            fswFill: '--'
        }
    },
    methods: {
        getViewContext() {
            let tableComponent = this.$refs.tableComponent;

            if (tableComponent) {
                return tableComponent.getViewContext();
            }
        },
        updateHeader() {
            this.fswValid = this.table.fswValid;
            this.fswInvalid = this.table.fswInvalid;
            this.fswFill = this.table.fswFill;
        }
    }
};

class ProductSummaryViewProvider {
    constructor(openmct) {
        this.openmct = openmct;

        this.key = 'vista.packetSummaryViewProvider';
        this.name = 'Packet Summary View';
        this.cssClass = 'icon-tabular-realtime';
    }

    canView(domainObject) {
        return domainObject.type === 'vista.packetSummaryEvents' || domainObject.type === 'vista.packetSummaryView';
    }

    view(domainObject, objectPath) {
        let table = new PacketSummaryTable(domainObject, openmct);
        let component;

        const view = {
            show: function (element, editMode) {
                component = new Vue({
                    el: element,
                    components: {
                        PacketSummaryViewComponent
                    },
                    data() {
                        return {
                            isEditing: editMode,
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
                        `<packet-summary-view-component
                            ref="packetSummaryViewComponent"
                            :view="view"
                            :isEditing="isEditing"
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
                    let context = component.$refs.packetSummaryViewComponent.getViewContext();

                    return context;
                } else {
                    return {
                        type: 'telemetry-table'
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
        return domainObject.type === 'vista.packetSummaryView';
    }
}

export { ProductSummaryViewProvider as default };
