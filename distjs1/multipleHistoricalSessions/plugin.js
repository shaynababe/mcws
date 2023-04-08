import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import TableComponent from 'openmct.tables.components.Table';
import SessionService from 'services/session/SessionService';
import SessionTable from './sessionTable/SessionTable.js';
import HistoricalSessionMetadata from './HistoricalSessionMetadata.js';
import 'openmct.tables.TelemetryTable';
import 'openmct.tables.TelemetryTableRow';

var HistoricalSessionSelector = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-hss"},[(_vm.isLoading)?[_vm._m(0),_vm._v(" "),_vm._m(1)]:_vm._e(),_vm._v(" "),(!_vm.isLoading)?[_vm._m(2),_vm._v(" "),_c('div',{staticClass:"c-overlay__contents-main c-hss__view-wrapper"},[_c('div',{staticClass:"c-hss__section c-hss__hosts section-host"},[_c('div',{staticClass:"c-hss__section__header c-tab"},[_vm._v("Hosts")]),_vm._v(" "),_c('ul',{staticClass:"c-hss__section__content"},_vm._l((_vm.hosts),function(host){return _c('li',{key:host,staticClass:"c-tree__item-h",on:{"click":function($event){return _vm.selectHostAndFilterSessions(host)}}},[_c('div',{staticClass:"c-tree__item",class:{'is-navigated-object': host === _vm.selectedHost }},[_c('a',{staticClass:"c-tree__item__label c-object-label"},[_c('div',{staticClass:"c-tree__item__name c-object-label__name"},[_vm._v(_vm._s(host))])])])])}),0)]),_vm._v(" "),_c('div',{staticClass:"c-hss__section c-hss__sessions section-selector"},[_c('div',{staticClass:"c-hss__section__header c-tab"},[_vm._v("Sessions")]),_vm._v(" "),_c('div',{staticClass:"c-hss__section__content"},[_c('TelemetryTable',{attrs:{"marking":_vm.markingProp,"enable-legacy-toolbar":true},on:{"marked-rows-updated":_vm.updateSelectedSessions}})],1)])]),_vm._v(" "),_c('div',{staticClass:"c-overlay__button-bar"},[_c('a',{staticClass:"c-button c-button--major",class:{disabled: !_vm.selectedSessions.length},on:{"click":_vm.applyHistoricalSessions}},[_vm._v("\n                Filter By Selected Sessions\n            ")]),_vm._v(" "),_c('a',{staticClass:"c-button",class:{disabled: !_vm.activeSessions},on:{"click":_vm.clearHistoricalSessions}},[_vm._v("\n                Clear Filtering\n            ")]),_vm._v(" "),_c('a',{staticClass:"c-button",on:{"click":_vm.closeOverlay}},[_vm._v("\n                Cancel\n            ")])])]:_vm._e()],2)},
staticRenderFns: [function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-overlay__top-bar"},[_c('div',{staticClass:"c-overlay__dialog-title"},[_vm._v("Loading historical sessions...")])])},function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-overlay__contents-main c-hss__view-wrapper"},[_c('div',{staticClass:"wait-spinner"})])},function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-overlay__top-bar"},[_c('div',{staticClass:"c-overlay__dialog-title"},[_vm._v("Select Historical Sessions")]),_vm._v(" "),_c('div',{staticClass:"c-overlay__dialog-hint"},[_vm._v("Select one or more sessions to use for historical queries. Note that sessions may only be selected within one host at a time.")])])}],
    inject: ['openmct', 'table'],
    props: ['activeSessions'],
    components: {
        TelemetryTable: TableComponent
    },
    data() {
        return {
           hosts: [],
           selectedHost: '',
           sessionsFilteredByHost: [],
           selectedSessions: [],
           markingProp: {
                enable: true,
                useAlternateControlBar: true,
                rowName: "Session",
                rowNamePlural: "Sessions"
            },
            isLoading: true
        }
    },
    beforeDestroy() {
        this.table.destroy();
    },
    methods: {
        getUniq(key, array) {
            let entries = array.map(session => session[key]);

            return [...new Set(entries)];
        },
        updateDataInTable(sessions) {
            this.table.clearAndUpdateData(sessions);
        },
        selectHostAndFilterSessions(host){
            this.selectedHost = host;
            this.sessionServiceFilteredByHost = this.availableSessions.filter(session => session.host === host);
            this.$nextTick(() => {
                this.updateDataInTable(this.sessionServiceFilteredByHost);
            });
        },
        setMarkedSessions() {
            if(this.activeSessions.numbers && this.activeSessions.host) {
                this.availableSessions.forEach(session => {
                    if (this.activeSessions.numbers.some((sessionNumber => sessionNumber == session.number))
                        && this.activeSessions.host === session.host) {

                        session.marked = true;
                    }
                });
            }
        },
        setAvailableSessions(sessions) {
            this.$emit('update-available-sessions', sessions);
            let primaryHost;

            this.isLoading = false;
            this.availableSessions = sessions;
            this.setMarkedSessions();
            this.hosts = this.getUniq('host', this.availableSessions);
            
            if (this.activeSessions.host) {
                primaryHost = this.activeSessions.host;
            } else {
                primaryHost = this.hosts[0];
            }

            this.selectHostAndFilterSessions(primaryHost);
        },
        getAvailableSessions() {
            this.sessionService.getHistoricalSessions({}).then(this.setAvailableSessions);
        },
        updateSelectedSessions(sessions) {
            this.selectedSessions = sessions;
        },
        clearHistoricalSessions() {
            this.sessionService.setHistoricalSession();
            this.closeOverlay();
        },
        applyHistoricalSessions() {
            let selectedSessions  = this.selectedSessions.map(row => row.datum),
                host = this.selectedHost,
                startTime,
                endTime;

                selectedSessions.forEach((session, index) => {
                    if (index === 0) {
                        startTime = session.start_time;
                        endTime = session.end_time;
                    }

                    if(session.start_time < startTime) {
                        startTime = session.start_time;
                    }
                    
                    if (session.end_time > endTime) {
                        endTime = session.end_time;
                    }
                });

            let sessionObject = {
                host,
                start_time: startTime,
                end_time: endTime,
                numbers: selectedSessions.map(s => s.number)
            };

            this.sessionService.setHistoricalSession(sessionObject);
            this.closeOverlay();
        },
        closeOverlay() {
            if (this.overlay) {
                this.overlay.dismiss();
                delete this.overlay;
            }
        },
        openOverlay() {
            this.overlay = this.openmct.overlays.overlay({
                element: this.$el,
                size: 'large',
                dismissable: true,
                onDestroy: () => {
                   this.$emit('close-session-selector'); 
                }
            });
        }
    },
    mounted() {
        this.sessionService = SessionService();

        this.getAvailableSessions();
        this.openOverlay();
    }
};

var HistoricalSessionIndicator = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"h-indicator"},[_c('div',{staticClass:"c-indicator icon-session",class:{
            's-status-on': _vm.activeSessions.numbers,
            's-status-available': _vm.availableSessions.length
        }},[(_vm.historicalSessionDisabled)?_c('span',{staticClass:"c-indicator__label"},[_c('span',{staticClass:"angular-w"},[_vm._v("\n                Historical Session Filtering Disabled in Config\n            ")])]):_c('span',{staticClass:"c-indicator__label",staticStyle:{"display":"flex","flex-direction":"column"}},[(_vm.availableSessions.length)?[(_vm.activeSessions.numbers)?_c('span',{staticClass:"angular-w"},[_vm._v("\n                    "+_vm._s(_vm.filteredByMessageString)+"\n                    "),_c('button',{on:{"click":_vm.openSessionSelector}},[_vm._v("\n                        Change\n                    ")]),_vm._v(" "),_c('button',{on:{"click":_vm.clearAllSessions}},[_vm._v("\n                        Clear\n                    ")])]):_c('span',{staticClass:"angular-w"},[_vm._v("\n                    Filter by historical sessions\n                    "),_c('button',{on:{"click":_vm.openSessionSelector}},[_vm._v("\n                        Select\n                    ")])])]:_c('span',{staticClass:"angular-w"},[_vm._v("\n                No Historical Sessions Available\n                "),_c('button',{class:{disabled: _vm.isRequestingSessions},on:{"click":_vm.checkForHistoricalSessions}},[_vm._v("\n                    "+_vm._s(_vm.isRequestingSessions ? 'Requesting...' : 'Request')+"\n                ")])])],2)]),_vm._v(" "),(_vm.showSessionSelector)?_c('historical-session-selector',{attrs:{"activeSessions":_vm.activeSessions},on:{"update-available-sessions":_vm.setAvailableSessions,"close-session-selector":_vm.closeSessionSelector}}):_vm._e()],1)},
staticRenderFns: [],
    inject: [
        'openmct',
        'table'
    ],
    components: {
        HistoricalSessionSelector
    },
    computed: {
        filteredByMessageString() {
            let sessionOrSessions;

            if (this.activeSessions.numbers.length === 1) {
                sessionOrSessions = 'session';
            } else {
                sessionOrSessions = 'sessions';
            }
            return `Historical queries filtered by ${this.activeSessions.numbers.length} ${sessionOrSessions}`;
        }
    },
    data() {
        return {
            activeSessions: {},
            numFilteredSessions: 8,
            availableSessions: [],
            showSessionSelector: false,
            isRequestingSessions: false,
            historicalSessionDisabled: false
        }
    },
    methods: {
        onActiveSessionChange(sessions) {
            if (sessions) {
                this.activeSessions = sessions;
            } else {
                this.activeSessions = {};
            }
        },  
        setAvailableSessions(sessions) {
            this.isRequestingSessions = false;
            this.availableSessions = sessions;
        },
        openSessionSelector() {
            this.showSessionSelector = true;
        },
        closeSessionSelector() {
            this.showSessionSelector = false;
        },
        clearAllSessions() {
            this.sessionService.setHistoricalSession();
        },
        checkForHistoricalSessions() {
            this.isRequestingSessions = true;
            this.sessionService.getHistoricalSessions({}).then(this.setAvailableSessions);
        }
    },
    mounted() {
        this.sessionService = SessionService();
        this.historicalSessionDisabled = this.sessionService.historicalSessionFilterConfig.disable;

        window.setTimeout(this.checkForHistoricalSessions, 2000);

        this.unsubscribeSessionListener = this.sessionService.listenForHistoricalChange(this.onActiveSessionChange);

        let activeSessions = this.sessionService.getHistoricalSession();
        this.onActiveSessionChange(activeSessions);
    },
    destroyed() {
        this.table.extendsDestroy();    
        this.unsubscribeSessionListener();
    }
};

function HistoricalSessionsPlugin() {
    return function install(openmct) {
        let indicator = {
                element: document.createElement('div'),
                priority: -1
            };

        openmct.indicators.add(indicator);

        openmct.on('start', () => {
            let instantiate = openmct.$injector.get('instantiate'),
                model = {
                    identifier: {
                        key: 'session-historical',
                        namespace: ''
                    },
                    name: 'Historical Session',
                    type: 'vista.channel'
                };
            
            let oldStyleDomainObject = instantiate(model),
                newStyleDomainObject = oldStyleDomainObject.useCapability('adapter');

            let table = new SessionTable(newStyleDomainObject, openmct, HistoricalSessionMetadata),
                objectPath = [model];

            new Vue ({
                el: indicator.element,
                provide: {
                    openmct,
                    table,
                    objectPath,
                    currentView: {}
                },
                components: {
                    HistoricalSessionIndicator
                },
                template: '<HistoricalSessionIndicator></HistoricalSessionIndicator>'
            });
        });
    };
}

export { HistoricalSessionsPlugin as default };
