import mcws from 'services/mcws/mcws';

const MCWS_PERSISTENCE_CHECK_NAMESPACE = '';
const MCWS_PERSISTENCE_CHECK_INTERVAL = 15000;
const CONNECTION_STATES = {
    CONNECTED: {
        text: "Connected",
        statusClass: "s-status-ok",
        description: "Connected to the domain object database."
    },
    DISCONNECTED: {
        text: "Disconnected",
        statusClass: "s-status-error",
        description: "Unable to connect to the domain object database."
    },
    PENDING: {
        text: "Checking connection..."
    }
};

var MCWSIndicator = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-indicator icon-database",class:_vm.statusClass,attrs:{"text":_vm.stateDescription}},[_c('span',{staticClass:"label c-indicator__label"},[_vm._v("\n        "+_vm._s(_vm.stateText)+"\n    ")])])},
staticRenderFns: [],
    inject: ['openmct'],
    computed: {
        statusClass() {
            let mcwsState = this.state;

            return mcwsState.statusClass;
        },
        stateText() {
            let mcwsState = this.state;

            return mcwsState.text;
        },
        stateDescription() {
            let mcwsState = this.state;

            return mcwsState.description;
        }
    },
    data() {
        return {
            state: CONNECTION_STATES.PENDING,
            namespace: ''
        };
    },
    destroyed() {
        clearInterval(this.intervalId);
    },
    mounted() {
        this.namespace = mcws.namespace(MCWS_PERSISTENCE_CHECK_NAMESPACE);
        this.updateIndicator();
        this.intervalId = setInterval(this.updateIndicator, MCWS_PERSISTENCE_CHECK_INTERVAL);
    },
    methods: {
        updateIndicator() {
            this.namespace.read().then(
                () => { this.state = CONNECTION_STATES.CONNECTED; },
                () => { this.state = CONNECTION_STATES.DISCONNECTED; }
           );
        }
    }
};

export { MCWSIndicator as M };
