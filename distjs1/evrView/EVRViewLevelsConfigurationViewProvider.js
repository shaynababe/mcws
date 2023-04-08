import { V as Vue } from '../vue.runtime.esm-15b08281.js';

var EVRViewLevelsConfigurationView = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-inspect-properties"},[(_vm.isEditing)?[_c('div',{staticClass:"c-inspect-properties__header"},[_vm._v("\n            EVR Levels\n        ")]),_vm._v(" "),_c('ul',{staticClass:"c-inspect-properties__section"},_vm._l((_vm.levels),function(isEnabled,key){return _c('li',{key:key,staticClass:"c-inspect-properties__row"},[_c('div',{staticClass:"c-inspect-properties__label",attrs:{"title":key}},[_c('label',{style:(_vm.levelsStyles[key]),attrs:{"for":key}},[_vm._v("\n                        "+_vm._s(key)+"\n                    ")])]),_vm._v(" "),_c('div',{staticClass:"c-inspect-properties__value"},[_c('input',{attrs:{"id":key,"type":"checkbox"},domProps:{"checked":isEnabled},on:{"change":function($event){return _vm.toggleLevelEnabled(key)}}})])])}),0)]:_vm._e()],2)},
staticRenderFns: [],
    inject: ['openmct'],
    props: {
        options: {
            type: Object,
            required: true
        },
        domainObject: {
            type: Object,
            required: true
        }
    },
    computed: {
        levels() {
            const existingLevels = this.domainObject.configuration && this.domainObject.configuration.levels;
            // Assign in this order to maintain level order as specified in config
            // evrForegroundColorByLevel and evrBackgroundColorByLevel should have identical keys
            const levels = Object.assign(
                {},
                this.options.evrForegroundColorByLevel,
                this.options.evrBackgroundColorByLevel,
                existingLevels
            );

            Object.keys(levels).forEach(key => {
                levels[key] = Boolean(levels[key]);
            });

            if (this.options.evrDefaultForegroundColor || this.options.evrDefaultBackgroundColor) {
                levels.DEFAULT = true;
            }

            return levels;
        },
        levelsStyles() {
            const styles = {};

            Object.keys(this.levels).forEach(key => {
                const foregroundColor = key === 'DEFAULT'
                    ? this.options.evrDefaultForegroundColor
                    : this.options.evrForegroundColorByLevel[key];
                const backgroundColor = key === 'DEFAULT'
                    ? this.options.evrDefaultBackgroundColor
                    : this.options.evrBackgroundColorByLevel[key];
                
                styles[key] = {};

                if (foregroundColor) {
                    styles[key].color = foregroundColor;
                }

                if (backgroundColor) {
                    styles[key].background = backgroundColor;
                }
            });
            
            return styles;
        }
    },
    data() {
        return {
            isEditing: this.openmct.editor.isEditing()
        };
    },
    methods: {
        toggleEdit(isEditing) {
            this.isEditing = isEditing;
        },
        toggleLevelEnabled(key) {
            const levels = this.levels;
            levels[key] = !levels[key];
            
            this.openmct.objects.mutate(this.domainObject, 'configuration.levels', levels);
        }
    },
    mounted() {
        this.openmct.editor.on('isEditing', this.toggleEdit);
    },
    destroyed() {
        this.openmct.editor.off('isEditing', this.toggleEdit);
    }
};

function EVRViewLevelsConfigurationViewProvider(options) {
    return {
        key: 'vista.evrView-configuration',
        name: 'EVR View Levels Configuration',
        canView: function (selection) {
            if (selection.length === 0) {
                return false;
            }

            let object = selection[0][0].context.item;

            return object && object.type === 'vista.evrView';
        },
        view: function (selection) {
            let component;
            let domainObject = selection[0][0].context.item;

            return {
                show: function (element) {
                    component = new Vue({
                        el: element,
                        provide: {
                            openmct
                        },
                        data() {
                            return {
                                domainObject: domainObject,
                                options: options
                            };
                        },
                        components: {
                            EvrLevelsConfiguration: EVRViewLevelsConfigurationView
                        },
                        template: `
                            <evr-levels-configuration
                                :domain-object="domainObject"
                                :options="options"
                            ></evr-levels-configuration>
                        `,
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
    };
}

export { EVRViewLevelsConfigurationViewProvider as default };
