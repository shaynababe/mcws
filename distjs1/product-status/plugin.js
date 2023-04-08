import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import DataProductViewProvider from './DataProductViewProvider.js';
import DATDownloadCell from './DATDownloadCell.js';
import EMDDownloadCell from './EMDDownloadCell.js';
import EMDPreviewCell from './EMDPreviewCell.js';
import TXTDownloadCell from './TXTDownloadCell.js';
import { l as lodashExports } from '../lodash-3c3e13ab.js';
import TelemetryTableConfiguration from 'openmct.tables.TelemetryTableConfiguration';
import viewActions from './DataProductViewActions.js';
import 'openmct.tables.components.Table';
import './DataProductCell.js';
import '../_commonjsHelpers-76cdd49e.js';

var DataProductAutoclear = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.isEditing)?_c('div',{staticClass:"c-properties"},[_c('div',{staticClass:"c-properties__header"},[_vm._v("Auto-clear Completed Products")]),_vm._v(" "),_c('ul',{staticClass:"c-properties__section"},[_c('li',{staticClass:"c-properties__row"},[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"c-properties__value"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.autoClearTimeout),expression:"autoClearTimeout"}],ref:"autoClearTimeout",staticClass:"c-input--sm c-input-number--no-spinners",attrs:{"type":"number"},domProps:{"value":(_vm.autoClearTimeout)},on:{"change":_vm.setAutoClearTimeout,"input":function($event){if($event.target.composing){ return; }_vm.autoClearTimeout=$event.target.value;}}})])])])]):_vm._e()},
staticRenderFns: [function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-properties__label",attrs:{"title":"Automatically remove completed data products after a number of minutes. If left blank, completed products will not be removed from the view."}},[_c('label',[_vm._v("Clear after minutes")])])}],
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
            this.openmct.objects.mutate(this.domainObject, 'configuration.autoClearTimeout', this.$refs.autoClearTimeout.value);
        }
    },
    mounted() {
        this.domainObject = this.openmct.selection.get()[0][0].context.item;
        this.autoClearTimeout = lodashExports.get(this.domainObject, 'configuration.autoClearTimeout');
        this.unlisteners = [];
        this.openmct.editor.on('isEditing', this.toggleEdit);
    },
    destroyed() {
        this.openmct.editor.off('isEditing', this.toggleEdit);
        this.unlisteners.forEach((unlisten) => unlisten());
    }
};

function install() {
    return function ProductStatusPlugin(openmct) {
        openmct.types.addType('vista.dataProductsView', {
            name: "Data Product View",
            description: "Shows data product status information",
            cssClass: "icon-tabular-lad",
            creatable: true,
            initialize(domainObject) {
                domainObject.composition = [];
            }
        });
        openmct.objectViews.addProvider(new DataProductViewProvider(openmct));
        
        openmct.inspectorViews.addProvider({
            key: 'vista.dataProducts-configuration',
            name: 'Data Products Autoclear Configuration',
            canView: function (selection) {
                if (selection.length === 0) {
                    return false;
                }
                let object = selection[0][0].context.item;
                return object && object.type === 'vista.dataProductsView';
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
                                DataProductAutoclear
                            },
                            template: '<data-product-autoclear></data-product-autoclear>',
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

        openmct.inspectorViews.addProvider(new VistaTableConfigurationProvider('vista.data-products-configuration', 
            'Data Products View Configuration', 'vista.dataProductsView'));

        // Suppress new views via monkey-patching (for now)
        let wrappedGet = openmct.objectViews.get;
        openmct.objectViews.get = function (domainObject) {
            const restrictedViews = ['plot-single', 'table'];

            return wrappedGet.apply(this, arguments).filter(
                viewProvider => !(domainObject.type === 'vista.dataProducts' && restrictedViews.includes(viewProvider.key))
            );
        };
        
        viewActions.forEach(action => {
            openmct.actions.register(action);
        });

        Vue.component('vista-table-dat-cell', DATDownloadCell);
        Vue.component('vista-table-emd-cell', EMDDownloadCell);
        Vue.component('vista-table-emd-preview-cell', EMDPreviewCell);
        Vue.component('vista-table-txt-cell', TXTDownloadCell);
    }
}

export { install as default };
