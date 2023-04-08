import { V as Vue } from '../vue.runtime.esm-15b08281.js';

//import MCWSURLBuilder from '../MCWSURLBuilder';

const FILTER_SUFFIX = "Filter";
const FILTER_OPTIONS = ['spsc', 'apid', 'vcid'];
const SORT_OPTIONS =
    ['session_id', 'rct', 'scet', 'ert', 'sclk', 'apid', 'spsc', 'vcid', 'ls'];

const MINIMUM_QUERY_MESSAGE =
    'One of "Query by Session" or "Bound to Time Conductor"' +
    ' must be selected in order to query for packet content.';
const SESSION_ID_MESSAGE =
    'Must specify Session ID to query by session.';

const rows = {
    useSession: {
        name: "Query by Session",
        control: "checkbox",
        key: "useSession"
    },
    sessionId: {
        name: "Session ID",
        control: "textfield",
        key: "sessionId"
    },
    useTimeConductor: {
        name: "Bound to Time Conductor",
        control: "checkbox",
        key: "useTimeConductor"
    },
    sortBy: {
        name: "Sort by",
        control: "select",
        options: SORT_OPTIONS.map(function (option) {
            return {
                name: option,
                value: option
            };
        }),
        key: "sortBy"
    }
};

const filterRows = [];

const formStructure = {
    sections: [
        {
            name: "Session Selection",
            rows: [ rows.useSession, rows.sessionId ],
        },
        {
            name: "Time Range",
            rows: [ rows.useTimeConductor ]
        },
        {
            name: "Additional Filters",
            rows: filterRows
        },
        {
            name: "Sorting",
            rows: [ rows.sortBy ]
        }
    ],
    buttons: {
        submit: {
            label: "Run Query",
        },
        cancel: {
            hide: true
        }
    }
};

var PacketQueryView = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{ref:"form"}),_vm._v(" "),_c('div',{ref:"message"},[_vm._v("\n        "+_vm._s(_vm.message)+"\n    ")])])},
staticRenderFns: [],
    inject: [
        'openmct',
        'objectPath'
    ],
    props: {
        domainObject: {
            type: Object,
            require: true
        }
    },
    computed: {
        filterRows() {
            return FILTER_OPTIONS.map(key => {
                const propertyName = key + FILTER_SUFFIX;

                return {
                    name: key.toUpperCase(),
                    key: propertyName,
                };
            });
        },
        message() {
            if (this.noFilterSelected) {
                return MINIMUM_QUERY_MESSAGE;
            }
            
            if (this.noSessionId) {
                return SESSION_ID_MESSAGE;
            }

            return '';
        },
        isValid() {
            return !Boolean(this.message);
        },
        noFilterSelected() {
            return !this.queryModel.useSession && !this.queryModel.useTimeConductor;
        },
        noSessionId() {
            return this.queryModel.useSession && !this.queryModel.sessionId;
        }
    },
    watch: {
        'queryModel.useSession': {
            handler(change, old) {
                this.validateForm();
            }
        },
        'queryModel.sessionId': {
            handler(change, old) {
                this.validateForm();
            }
        },
        'queryModel.useTimeConductor': {
            handler(change, old) {
                this.validateForm();
            }
        }
    },
    data() {

        return {
            queryModel: {
                useSession: undefined,
                sessionId: undefined,
                useTimeConductor: undefined
            },
            
        };
    },
    mounted() {
        this.formElement = this.$refs.form;
        this.setFilterOptions();
        this.showForm();
    },
    methods: {
        initializeQueryModel() {
            this.$set(this.queryModel, 'useSession' , false);
            this.$set(this.queryModel, 'sessionId', '');
            this.$set(this.queryModel, 'useTimeConductor', false);
        },
        onChange(change) {
            this.$set(
                this.queryModel,
                change.model.key,
                change.value
            );
        },
        setFilterOptions() {
            FILTER_OPTIONS.forEach(key => {
                const propertyName = key + FILTER_SUFFIX;
                this.$set(this.queryModel, propertyName, '');

                filterRows.push({
                    name: key.toUpperCase(),
                    key: propertyName,
                    control: "textfield"
                });
            });
        },
        showForm() {
            const options = {
                element: this.formElement,
                onChange: this.onChange
            };

            this.initializeQueryModel();

            this.openmct.forms.showForm(formStructure, options)
                .then(this.resolveFormPromise.bind(this));

            this.runQueryButton = this.formElement.querySelector('.c-button.c-button--major');
        },
        resolveFormPromise(changes) {
            this.submitQuery(changes);
            this.showForm();
        },
        validateForm() {
            if (this.isValid) {
                this.runQueryButton.disabled = undefined;
            } else {
                this.runQueryButton.disabled = true;
            }
        },
        submitQuery(queryModel) {
            const link = document.createElement("a");
            const url = this.domainObject.telemetry.dataProductContentUrl;
            const builder = new MCWSURLBuilder(url);

            if (queryModel.useSession) {
                builder.filter('session_id', queryModel.sessionId);
            }

            if (queryModel.useTimeConductor) {
                const bounds = this.openmct.time.bounds();
                const start = bounds.start;
                const end = bounds.end;
                const timeSystem = openmct.time.timeSystem();
                const domain = timeSystem.key;

                const format = openmct.telemetry.getFormatter(timeSystem.timeFormat);

                builder.filter(domain, format.format(start), ">");
                builder.filter(domain, format.format(end), "<");
            }

            FILTER_OPTIONS.forEach(option => {
                const property = option + FILTER_SUFFIX;
                if (queryModel[property]) {
                    builder.filter(option, queryModel[property]);
                }
            });

            if (queryModel.sortBy) {
                builder.sort(queryModel.sortBy);
            }

            link.href = builder.url();
            link.download = '';
            link.target = "_blank";
            link.click();
        }
    }
};

class PacketQueryViewProvider {
    constructor(openmct) {
        this.openmct = openmct;

        this.key = 'vista.packetQuery';
        this.name = 'Packet Query';
    }

    canView(domainObject) {
        return domainObject.type === 'vista.packets';
    }

    view(domainObject, objectPath) {
        let component;

        const view = {
            show: function (element) {
                component = new Vue({
                    el: element,
                    components: {
                        PacketQueryView
                    },
                    data() {
                        return {
                            domainObject,
                            view
                        };
                    },
                    provide: {
                        openmct,
                        objectPath,
                        currentView: view
                    },
                    template:
                        `<packet-query-view
                            ref="packetSummaryView"
                            :domain-object="domainObject"
                            :view="view"
                        />`
                });
            },
            destroy: function (element) {
                component.$destroy();
                component = undefined;
            }
        };

        return view;
    }

    priority() {
        return this.openmct.priority.LOW;
    }
}

export { PacketQueryViewProvider as default };
