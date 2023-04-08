import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import FrameWatchTable from './FrameWatchTable.js';
import TableComponent from 'openmct.tables.components.Table';
import { FRAME_WATCH_TYPE } from './config.js';
import 'openmct.tables.TelemetryTable';
import './FrameWatchRowCollection.js';
import 'openmct.tables.collections.TableRowCollection';
import './encodingwatch/EncodingWatchRow.js';
import './FrameWatchRow.js';
import 'openmct.tables.TelemetryTableRow';
import 'services/dataset/DatasetCache';
import '../_commonjsHelpers-76cdd49e.js';

var FrameWatchViewComponent = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-table"},[_c('div',{staticClass:"c-table-summary"},[_c('div',{staticClass:"c-table-and-summary__summary-item"},[_vm._v("FSW Valid Frames: "+_vm._s(_vm.validFrames))]),_vm._v(" "),_c('div',{staticClass:"c-table-and-summary__summary-item"},[_vm._v("FSW Invalid Frames: "+_vm._s(_vm.invalidFrames))]),_vm._v(" "),_c('div',{staticClass:"c-table-and-summary__summary-item"},[_vm._v("FSW Idle Frames: "+_vm._s(_vm.idleFrames))])]),_vm._v(" "),_c('div',{staticClass:"v-frame-watch-table"},[_c('table-component',{ref:"tableComponent",attrs:{"allowSorting":true,"isEditing":_vm.isEditing,"marking":_vm.markingProp,"view":_vm.view}})],1)])},
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
            validFrames: '--',
            invalidFrames: '--',
            idleFrames: '--'
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
            this.validFrames = this.table.validFrames;
            this.invalidFrames = this.table.invalidFrames;
            this.idleFrames = this.table.idleFrames;
        }
    }
};

class FrameWatchViewProvider {
    constructor(openmct, key, name, type = FRAME_WATCH_TYPE) {
        this.openmct = openmct;

        this.key = key;
        this.name = name;
        this.cssClass = 'icon-tabular-lad';
        this.type = type;
    }

    canView(domainObject) {
        return domainObject.type === this.type || domainObject.type === 'vista.frameSummary';
    }

    view(domainObject, objectPath) {
        let table = new FrameWatchTable(domainObject, openmct, this.type);
        let component;

        const view = {
            show: function (element, editMode) {
                component = new Vue({
                    el: element,
                    components: {
                        FrameWatchViewComponent
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
                    template: `
                        <frame-watch-view-component
                            ref="frameWatchViewComponent"
                            :view="view"
                            :isEditing="isEditing"
                        />
                    `
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
                    let context = component.$refs.frameWatchViewComponent.getViewContext();

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
        return domainObject.type === this.type;
    }
}

export { FrameWatchViewProvider as default };
