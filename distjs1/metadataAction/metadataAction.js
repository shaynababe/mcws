import { V as Vue } from '../vue.runtime.esm-15b08281.js';

var MetadataListView = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-attributes-view"},[_c('div',{staticClass:"c-overlay__top-bar"},[_c('div',{staticClass:"c-overlay__dialog-title"},[_vm._v(_vm._s(("Attributes for " + _vm.name)))])]),_vm._v(" "),_c('div',{staticClass:"c-overlay__contents-main l-preview-window__object-view"},[_c('ul',{staticClass:"c-attributes-view__content"},_vm._l((Object.keys(_vm.attributes)),function(attribute){return _c('li',{key:attribute},[_c('span',{staticClass:"c-attributes-view__grid-item__label"},[_vm._v(_vm._s(attribute))]),_vm._v(" "),_c('span',{staticClass:"c-attributes-view__grid-item__value"},[_vm._v(_vm._s(_vm.attributes[attribute]))])])}),0)])])},
staticRenderFns: [],
    inject: ['name', 'attributes']
};

class MetadataAction {
    constructor(openmct) {
        this.name = 'View Attributes';
        this.key = 'metadata-action';
        this.description = 'Shows dictionary attributes related to this object';
        this.cssClass = 'icon-info';

        this._openmct = openmct;
    }
    invoke(objectPath) {
        let domainObject = objectPath[0],
            name = domainObject.name,
            attributes = domainObject.telemetry.definition,
            component = new Vue ({
                provide: {
                    name,
                    attributes
                },
                components: {
                    MetadataListView
                },
                template: '<MetadataListView/>'
            });
            this._openmct.overlays.overlay({
                element: component.$mount().$el,
                size: 'large',
                dismissable: true,
                onDestroy: () => {
                    component.$destroy();
                }
            });
    }
    appliesTo(objectPath) {
        let contextualDomainObject = objectPath[0];

        return contextualDomainObject.type === 'vista.evr' || contextualDomainObject.type === 'vista.channel';
    }
}

export { MetadataAction as default };
