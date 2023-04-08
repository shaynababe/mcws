import { V as Vue } from '../../vue.runtime.esm-15b08281.js';
import DatasetCache from 'services/dataset/DatasetCache';

var ImportWithDatasetsFormComponent = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"form-control"},[(_vm.hasImport)?_c('span',{staticClass:"field control",class:_vm.model.cssClass},[(!_vm.hasReferencedDatasets)?_c('div',[_vm._v("\n            "+_vm._s(_vm.noDatasetMappingRequiredText)+"\n        ")]):(_vm.hasOneToOneMapping)?_c('div',[_vm._v("\n            "+_vm._s(_vm.noDatasetMappingRequiredText)+"\n        ")]):(_vm.hasReferencedDatasets && !_vm.hasDatasets)?_c('div',[_vm._v("\n            "+_vm._s(_vm.noDatasetsText)+"\n        ")]):[_c('div',[_vm._v("\n                "+_vm._s(_vm.mappingInstructionsText)+"\n            ")]),_vm._v(" "),_c('div',{staticClass:"c-form--sub-grid"},_vm._l((_vm.referencedDatasets),function(referencedDataset){return _c('div',{key:_vm.makeKeyString(referencedDataset),staticClass:"c-form__row"},[_c('span',{staticClass:"req-indicator req"}),_vm._v(" "),_c('label',[_vm._v(_vm._s(_vm.getDatasetName(referencedDataset)))]),_vm._v(" "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.mapping[_vm.makeKeyString(referencedDataset)]),expression:"mapping[makeKeyString(referencedDataset)]"}],staticClass:"field control select-field",on:{"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(_vm.mapping, _vm.makeKeyString(referencedDataset), $event.target.multiple ? $$selectedVal : $$selectedVal[0]);},_vm.onChange]}},_vm._l((_vm.datasetOptions),function(option){return _c('option',{key:option.value,domProps:{"value":option.value,"selected":option.value === _vm.mapping[_vm.makeKeyString(referencedDataset)]}},[_vm._v("\n                            "+_vm._s(option.name)+"\n                        ")])}),0)])}),0)]],2):_vm._e()])},
staticRenderFns: [],
    inject: ['openmct'],
    props: {
        model: {
            type: Object,
            required: true
        },
        datasets: {
            type: Array,
            default: undefined
        },
        referencedDatasets: {
            type: Array,
            default: undefined
        },
        hasImport: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        noDatasetMappingRequiredText() {
            return 'All set. The import does not need dataset mapping.';
        },
        noDatasetsText() {
            return 'The import contains references to datasets that need to be mapped to an existing dataset. Create a dataset before importing.';
        },
        mappingInstructionsText() {
            return 'For each referenced dataset on the left, select an existing dataset on the right.';
        },
        hasReferencedDatasets() {
            return this.referencedDatasets?.length > 0;
        },
        hasDatasets() {
            return this.datasets?.length > 0;
        },
        datasetOptions() {
            return this.datasets.map(dataset => {
                const keyString = this.makeKeyString(dataset);
                const name = this.getDatasetName(dataset);

                return {
                    name: name,
                    value: keyString
                };
            });
        },
        hasOneToOneMapping() {
            return this.datasets?.length === 1
                && this.referencedDatasets?.length === 1;
        },
    },
    data() {
        return {
            mapping: {}
        };
    },
    watch: {
        hasImport() {
            this.onHasImport();
        }
    },
    mounted() {
        this.data = {
            model: {
                key: this.model.key,
                property: this.model.property
            },
            value: this.mapping
        };
    },
    methods: {
        onHasImport() {
            this.buildMapping();
            this.onChange();
        },
        buildMapping() {
            this.referencedDatasets?.forEach(referencedDataset => {
                const referencedDatasetKeyString = this.makeKeyString(referencedDataset);
                const datasetKeyString = this.makeKeyString(this.datasets[0]);

                this.$set(this.mapping, referencedDatasetKeyString, datasetKeyString);
            });
        },
        makeKeyString(domainObject) {
            return this.openmct.objects.makeKeyString(domainObject.identifier);
        },
        getDatasetName(dataset) {
            const keyString = this.makeKeyString(dataset);
            const name = dataset.name || keyString;

            return name;
        },
        onChange(event) {
            this.validate();

            this.$emit('onChange', this.data);
        },
        validate() {
            this.model.validate(this.data, () => {
                if (this.hasReferencedDatasets) {
                    return this.hasDatasets;
                }

                return true;
            });
        }
    }
};

function importWithDatasetsModifier(openmct) {
    openmct.forms.addNewFormControl('import-with-datasets-controller', getImportWithDatasetsFormController(openmct));

    let datasets;
    let referencedDatasets;
    let component;

    const importAsJSONAction = openmct.actions._allActions['import.JSON'];

    if (importAsJSONAction) {
        const originalOnSaveFunction = importAsJSONAction.onSave.bind(importAsJSONAction);

        importAsJSONAction.onSave = (object, changes) => {
            const selectFile = changes.selectFile;
            const stringifiedObjectTree = selectFile.body;
            const datasetMapping = changes.mapping;

            Object.entries(datasetMapping).forEach(([referencedDataset, dataset]) => {
                stringifiedObjectTree.replace(referencedDataset, dataset);
            });

            return originalOnSaveFunction(object, changes);
        };

        importAsJSONAction._showForm = showFormWithDatasetMapping.bind(importAsJSONAction);
    }

    function showFormWithDatasetMapping(domainObject) {
        const formStructure = {
            title: this.name,
            sections: [
                {
                    rows: [
                        {
                            name: 'Select File',
                            key: 'selectFile',
                            control: 'file-input',
                            required: true,
                            text: 'Select File...',
                            validate: validateJSONAndMapDatasets,
                            type: 'application/json'
                        }
                    ]
                },
                {
                    rows: [
                        {
                            name: 'Dataset Mapping',
                            key: 'mapping',
                            control: 'import-with-datasets-controller',
                            hideFromInspector: true,
                            required: true,
                            property: ['mapping'],
                            text: 'Dataset Mapping',
                            validate: (data, callback) => {
                                return callback();
                            }
                        }
                    ]
                }
            ]
        };

        openmct.forms.showForm(formStructure)
            .then(changes => {
                let onSave = this.onSave.bind(this);
                onSave(domainObject, changes);
            })
            .catch(error => {
                component.$destroy();
            });
    }

    /**
     * @private
     * @param {object} data
     * @returns {boolean}
     */
    async function validateJSONAndMapDatasets(data) {
        const value = data.value;
        const objectTree = value && value.body;
        let json;
        let success = true;

        try {
            json = JSON.parse(objectTree);
        } catch(error) {
            success = false;
        }

        if (success && (!json.openmct || !json.rootId)) {
            success = false;
        }

        if (success) {
            const datasetCache = DatasetCache();

            datasets = await datasetCache.getDomainObjects();

            try {
                referencedDatasets = getReferencedDatasets(json);

                component.updateData(referencedDatasets, datasets);
            } catch(error) {
                success = false;
            }
        }

        if (!success) {
            openmct.notifications.error('Invalid File: The selected file was either invalid JSON or was not formatted properly for import into Open MCT.');
        }

        return success;
    }

    function getImportWithDatasetsFormController(openmct) {
        return {
            show(element, model, onChange) {
                component = new Vue({
                    el: element,
                    components: {
                        ImportWithDatasetsFormComponent
                    },
                    provide: {
                        openmct
                    },
                    data() {
                        return {
                            model,
                            onChange,
                            datasets,
                            referencedDatasets,
                            hasImport: false
                        };
                    },
                    template: `<ImportWithDatasetsFormComponent ref="importComponent" :model="model" :datasets="datasets" :referenced-datasets="referencedDatasets" :has-import="hasImport" @onChange="onChange" />`,
                    methods: {
                        updateData(updatedReferencedDatasets, updatedDatasets) {
                            this.datasets = updatedDatasets;
                            this.referencedDatasets = updatedReferencedDatasets;
                            this.hasImport = true;
                        }
                    }
                });

                return component;
            },
            destroy() {
                component.$destroy();
                resetAction();
            }
        };
    }

    function resetAction() {
        datasets = undefined;
        referencedDatasets = undefined;
        component = undefined;
    }

    function getReferencedDatasets(json) {
        const openmct = json.openmct;
        const referencedDatasets = new Set();

        Object.values(openmct)
            .forEach(object => object.composition
                ?.forEach(identifier => {
                    if (referencesDataset(identifier)) {
                        const datasetIdentifier = getDatasetIdentifier(identifier);
                        referencedDatasets.add({ identifier: datasetIdentifier });
                    }
                }));

        return Array.from(referencedDatasets);
    }

    function referencesDataset(identifier) {
        return identifier.namespace === 'vista';
    }

    function getDatasetIdentifier(identifier) {
        const parts = identifier.key.split(':');
        const namespace = parts[parts.length - 2];
        const key = parts[parts.length - 1];
        const datasetIdentifier = {
            namespace,
            key
        };

        return datasetIdentifier;
    }
}

export { importWithDatasetsModifier as default };
