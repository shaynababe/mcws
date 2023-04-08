import AlarmsViewProvider from './AlarmsViewProvider.js';
import viewActions from './AlarmsViewActions.js';
import TelemetryTableConfiguration from 'openmct.tables.TelemetryTableConfiguration';
import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import 'openmct.tables.components.Table';
import './AlarmsTable.js';
import '../lodash-3c3e13ab.js';
import '../_commonjsHelpers-76cdd49e.js';
import 'openmct.tables.TelemetryTable';
import './AlarmsViewHistoricalContextTableRow.js';
import 'openmct.tables.TelemetryTableRow';
import 'services/dataset/DatasetCache';
import 'types/types';

var AlarmsViewTimeoutComponent = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.isEditing)?_c('div',{staticClass:"c-properties"},[_c('div',{staticClass:"c-properties__header"},[_vm._v("Out-of-Alarm Channels")]),_vm._v(" "),_c('ul',{staticClass:"c-properties__section"},[_c('li',{staticClass:"c-properties__row"},[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"c-properties__value"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.autoClearTimeout),expression:"autoClearTimeout"}],attrs:{"type":"number"},domProps:{"value":(_vm.autoClearTimeout)},on:{"input":[function($event){if($event.target.composing){ return; }_vm.autoClearTimeout=$event.target.value;},_vm.setAutoClearTimeout]}})])])])]):_vm._e()},
staticRenderFns: [function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-properties__label",attrs:{"title":"Clear channels if no longer in alarm state"}},[_c('label',[_c('span',{staticStyle:{"white-space":"nowrap"}},[_vm._v("Auto-clear")]),_vm._v(" (minutes)")])])}],
    inject: ['openmct'],
    data() {
        return {
            headers: {},
            isEditing: this.openmct.editor.isEditing(),
            autoClearTimeout: undefined
        }
    },
    methods: {
        toggleEdit(isEditing) {
            this.isEditing = isEditing;
        },
        setAutoClearTimeout() {
            this.openmct.objects.mutate(this.domainObject, 'configuration.autoClearTimeout', this.autoClearTimeout);
        }
    },
    mounted() {
        this.domainObject = this.openmct.selection.get()[0][0].context.item;
        if (this.domainObject.configuration && this.domainObject.configuration.autoClearTimeout) {
            this.autoClearTimeout = this.domainObject.configuration.autoClearTimeout;
        }
        this.unlisteners = [];
        this.openmct.editor.on('isEditing', this.toggleEdit);
    },
    destroyed() {
        this.openmct.editor.off('isEditing', this.toggleEdit);
        this.unlisteners.forEach((unlisten) => unlisten());
    }
};

function AlarmsViewPlugin() {
    return function install(openmct) {
        openmct.objectViews.addProvider(new AlarmsViewProvider(openmct));

        viewActions.forEach(action => {
            openmct.actions.register(action);
        });

        openmct.types.addType('vista.alarmsView', {
            name: "Alarms View",
            description: "Drag and drop in an Alarm Message Stream node to show the latest alarm states of channels",
            cssClass: "icon-tabular-lad",
            creatable: true,
            initialize(domainObject) {
                domainObject.composition = [];
                domainObject.configuration = {
                    filters: {}
                };
            }
        });
        openmct.inspectorViews.addProvider({
            key: 'vista.alarmsView-configuration',
            name: 'Alarms View Timeout Configuration',
            canView: function (selection) {
                if (selection.length === 0) {
                    return false;
                }
                let object = selection[0][0].context.item;
                return object && object.type === 'vista.alarmsView';
            },
            view: function (selection) {
                let component;
                let domainObject = selection[0][0].context.item;
                const tableConfiguration = new TelemetryTableConfiguration(domainObject, openmct);
                return {
                    show: function (element) {
                        component = new Vue({
                            provide: {
                                openmct,
                                tableConfiguration
                            },
                            components: {
                                AlarmsViewTimeout: AlarmsViewTimeoutComponent
                            },
                            template: '<alarms-view-timeout></alarms-view-timeout>',
                            el: element
                        });
                    },
                    destroy: function () {
                        component.$destroy();
                        component = undefined;
                    }
                }
            },
            priority: function () {
                return 1;
            }
        });
        openmct.inspectorViews.addProvider(new VistaTableConfigurationProvider('vista.alarm-view-configuration', 
            'Alarm View Configuration', 'vista.alarmsView'));

        openmct.composition.addPolicy((parent, child) => {
            if (parent.type === 'vista.alarmsView') {
                return child.type === 'vista.alarmMessageStream'
            }
            return true;
        });
    }
}

export { AlarmsViewPlugin as default };
