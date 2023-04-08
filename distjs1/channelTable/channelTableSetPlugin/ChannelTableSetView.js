import { V as Vue } from '../../vue.runtime.esm-15b08281.js';

const CONTEXT_MENU_ACTIONS = [
        'viewDatumAction',
        'viewHistoricalData',
        'remove'
    ];
    const BLANK_VALUE = '---';
    var ChannelRow = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('tr',{staticClass:"js-lad-table__body__row",on:{"contextmenu":function($event){$event.preventDefault();return _vm.showContextMenu.apply(null, arguments)}}},[_c('td',{staticClass:"js-first-data"},[_vm._v(_vm._s(_vm.id))]),_vm._v(" "),_c('td',{staticClass:"js-second-data"},[_vm._v(_vm._s(_vm.name))]),_vm._v(" "),_c('td',{staticClass:"js-third-data",class:_vm.valueClass},[_vm._v(_vm._s(_vm.value))]),_vm._v(" "),_c('td',{staticClass:"js-fourth-data"},[_vm._v(_vm._s(_vm.formattedTimestamp))])])},
staticRenderFns: [],
        inject: ['openmct', 'currentView'],
        props: {
            domainObject: {
                type: Object,
                required: true
            },
            pathToTable: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                datum: undefined,
                timestamp: undefined,
                timestampKey: undefined
            };
        },
        computed: {
            name() {
                let parts = this.domainObject.name.split(' - ');

                return parts.length > 1 ? parts[1] : BLANK_VALUE;
            },
            id() {
                let parts = this.domainObject.name.split(' - ');

                return parts[0];
            },
            value() {
                if (!this.datum) {
                    return BLANK_VALUE;
                }
                return this.formats[this.valueKey].format(this.datum);
            },
            valueClass() {
                if (!this.datum) {
                    return '';
                }
                const limit = this.limitEvaluator.evaluate(this.datum, this.valueMetadata);
                return limit ? limit.cssClass : '';
            },
            formattedTimestamp() {
                if (!this.timestamp) {
                    return BLANK_VALUE;
                }
                return this.timeSystemFormat.format(this.timestamp);
            },
            timeSystemFormat() {
                if (!this.formats[this.timestampKey]) {
                    console.warn(`No formatter for ${this.timestampKey} time system for ${this.domainObject.name}.`);
                }
                return this.formats[this.timestampKey];
            },
            objectPath() {
                return [this.domainObject, ...this.pathToTable];
            }
        },
        mounted() {
            this.metadata = this.openmct.telemetry.getMetadata(this.domainObject);
            this.formats = this.openmct.telemetry.getFormatMap(this.metadata);
            this.keyString = this.openmct.objects.makeKeyString(this.domainObject.identifier);
            // this.timeContext = this.openmct.time.getContextForView(this.objectPath);
            this.limitEvaluator = this.openmct
                .telemetry
                .limitEvaluator(this.domainObject);
            this.openmct.time.on('timeSystem', this.updateTimeSystem);
            this.timestampKey = this.openmct.time.timeSystem().key;
            this.valueMetadata = undefined;
            if (this.metadata) {
                this.valueMetadata = this
                    .metadata
                    .valuesForHints(['range'])[0] || this.firstNonDomainAttribute(this.metadata);
            }
            this.valueKey = this.valueMetadata ? this.valueMetadata.key : undefined;
            this.telemetryCollection = this.openmct.telemetry.requestCollection(this.domainObject, {
                size: 1,
                strategy: 'latest',
                // timeContext: this.timeContext
            });
            this.telemetryCollection.on('add', this.setLatestValues);
            this.telemetryCollection.on('clear', this.resetValues);
            this.telemetryCollection.load();
        },
        destroyed() {
            this.openmct.time.off('timeSystem', this.updateTimeSystem);
            this.telemetryCollection.off('add', this.setLatestValues);
            this.telemetryCollection.off('clear', this.resetValues);
            this.telemetryCollection.destroy();
        },
        methods: {
            updateView() {
                if (!this.updatingView) {
                    this.updatingView = true;
                    requestAnimationFrame(() => {
                        this.timestamp = this.getParsedTimestamp(this.latestDatum);
                        this.datum = this.latestDatum;
                        this.updatingView = false;
                    });
                }
            },
            setLatestValues(data) {
                this.latestDatum = data[data.length - 1];
                this.updateView();
            },
            updateTimeSystem(timeSystem) {
                this.timestampKey = timeSystem.key;
            },
            updateViewContext() {
                this.$emit('rowContextClick', {
                    viewHistoricalData: true,
                    viewDatumAction: true,
                    getDatum: () => {
                        return this.datum;
                    }
                });
            },
            showContextMenu(event) {
                this.updateViewContext();
                const actions = CONTEXT_MENU_ACTIONS.map(key => this.openmct.actions.getAction(key));
                const menuItems = this.openmct.menus.actionsToMenuItems(actions, this.objectPath, this.currentView);
                if (menuItems.length) {
                    this.openmct.menus.showMenu(event.x, event.y, menuItems);
                }
            },
            resetValues() {
                this.timestamp = undefined;
                this.datum = undefined;
            },
            getParsedTimestamp(timestamp) {
                if (this.timeSystemFormat) {
                    return this.timeSystemFormat.parse(timestamp);
                }
            },
            firstNonDomainAttribute(metadata) {
                return metadata
                    .values()
                    .find(metadatum => metadatum.hints.domain === undefined && metadatum.key !== 'name');
            }
        }
    };

var ChannelTableSet = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{staticClass:"c-table c-lad-table"},[_c('thead',[_c('tr',[_c('th',[_vm._v("ID")]),_vm._v(" "),_c('th',[_vm._v("Title")]),_vm._v(" "),_c('th',[_vm._v("Value")]),_vm._v(" "),_c('th',[_vm._v(_vm._s(_vm.timesystem))])])]),_vm._v(" "),_c('tbody',[_vm._l((_vm.ladTableObjects),function(ladTable){return [_c('tr',{key:ladTable.key,staticClass:"c-table__group-header js-lad-table-set__table-headers"},[_c('td',{attrs:{"colspan":"10"}},[_vm._v("\n                    "+_vm._s(ladTable.domainObject.name)+"\n                ")])]),_vm._v(" "),_vm._l((_vm.ladTelemetryObjects[ladTable.key]),function(ladRow){return _c('channel-row',{key:ladRow.key,attrs:{"domain-object":ladRow.domainObject,"path-to-table":ladTable.objectPath},on:{"rowContextClick":_vm.updateViewContext}})})]})],2)])},
staticRenderFns: [],
    components: {
        ChannelRow
    },
    inject: ['openmct', 'objectPath', 'currentView'],
    props: {
        domainObject: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            ladTableObjects: [],
            ladTelemetryObjects: {},
            compositions: [],
            viewContext: {},
            timesystem: '---'
        };
    },
    mounted() {
        this.composition = this.openmct.composition.get(this.domainObject);
        this.composition.on('add', this.addLadTable);
        this.composition.on('remove', this.removeLadTable);
        this.composition.on('reorder', this.reorderLadTables);
        this.openmct.time.on('timeSystem', this.setTimesystem);
        this.setTimesystem(this.openmct.time.timeSystem());
        this.composition.load();
    },
    destroyed() {
        this.composition.off('add', this.addLadTable);
        this.composition.off('remove', this.removeLadTable);
        this.composition.off('reorder', this.reorderLadTables);
        this.compositions.forEach(c => {
            c.composition.off('add', c.addCallback);
            c.composition.off('remove', c.removeCallback);
        });
        this.openmct.time.off('timeSystem', this.setTimesystem);
    },
    methods: {
        addLadTable(domainObject) {
            let ladTable = {};
            ladTable.domainObject = domainObject;
            ladTable.key = this.openmct.objects.makeKeyString(domainObject.identifier);
            ladTable.objectPath = [domainObject, ...this.objectPath];
            this.$set(this.ladTelemetryObjects, ladTable.key, []);
            this.ladTableObjects.push(ladTable);
            let composition = this.openmct.composition.get(ladTable.domainObject);
            let addCallback = this.addTelemetryObject(ladTable);
            let removeCallback = this.removeTelemetryObject(ladTable);
            composition.on('add', addCallback);
            composition.on('remove', removeCallback);
            composition.load();
            this.compositions.push({
                composition,
                addCallback,
                removeCallback
            });
        },
        removeLadTable(identifier) {
            let index = this.ladTableObjects.findIndex(ladTable => this.openmct.objects.makeKeyString(identifier) === ladTable.key);
            let ladTable = this.ladTableObjects[index];
            this.$delete(this.ladTelemetryObjects, ladTable.key);
            this.ladTableObjects.splice(index, 1);
        },
        reorderLadTables(reorderPlan) {
            let oldComposition = this.ladTableObjects.slice();
            reorderPlan.forEach(reorderEvent => {
                this.$set(this.ladTableObjects, reorderEvent.newIndex, oldComposition[reorderEvent.oldIndex]);
            });
        },
        setTimesystem(timesystem) {
            this.timesystem = timesystem.name;
        },
        addTelemetryObject(ladTable) {
            return (domainObject) => {
                let telemetryObject = {};
                telemetryObject.key = this.openmct.objects.makeKeyString(domainObject.identifier);
                telemetryObject.domainObject = domainObject;
                let telemetryObjects = this.ladTelemetryObjects[ladTable.key];
                telemetryObjects.push(telemetryObject);
                this.$set(this.ladTelemetryObjects, ladTable.key, telemetryObjects);
            };
        },
        removeTelemetryObject(ladTable) {
            return (identifier) => {
                let telemetryObjects = this.ladTelemetryObjects[ladTable.key];
                let index = telemetryObjects.findIndex(telemetryObject => this.openmct.objects.makeKeyString(identifier) === telemetryObject.key);
                telemetryObjects.splice(index, 1);
                this.$set(this.ladTelemetryObjects, ladTable.key, telemetryObjects);
            };
        },
        updateViewContext(rowContext) {
            this.viewContext.row = rowContext;
        },
        getViewContext() {
            return this.viewContext;
        }
    }
};

class ChannelTableSetView {
    constructor(openmct, domainObject, objectPath) {
        this.openmct = openmct;
        this.domainObject = domainObject;
        this.objectPath = objectPath;
        this.component = undefined;
    }

    show(element) {
        this.component = new Vue({
            el: element,
            components: {
                ChannelTableSet
            },
            provide: {
                openmct: this.openmct,
                objectPath: this.objectPath,
                currentView: this
            },
            data: () => {
                return {
                    domainObject: this.domainObject
                };
            },
            template: '<channel-table-set ref="channelTableSet" :domain-object="domainObject"></channel-table-set>'
        });
    }

    getViewContext() {
        if (!this.component) {
            return {};
        }

        return this.component.$refs.channelTableSet.getViewContext();
    }

    destroy(element) {
        this.component.$destroy();
        this.component = undefined;
    }
}

export { ChannelTableSetView as default };
