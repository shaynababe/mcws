import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import SessionService from 'services/session/SessionService';

var RealtimeSessionSelector = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"u-contents"},[(_vm.isLoading)?[_vm._m(0),_vm._v(" "),_vm._m(1)]:_vm._e(),_vm._v(" "),[_vm._m(2),_vm._v(" "),_c('div',{staticClass:"c-overlay__dialog-hint"},[(_vm.topics.length)?_c('span',[_vm._v("Select a topic or session")]):_c('span',[_vm._v("No topics are currently available")])]),_vm._v(" "),_c('div',{staticClass:"l-topics-tree-wrapper selector-list"},[_c('ul',{staticClass:"c-tree l-topics-tree"},_vm._l((_vm.topics),function(topic,index){return _c('li',{key:index,staticClass:"c-tree__item-h"},[_c('div',{staticClass:"c-tree__item",class:{ 'is-selected': topic.selected }},[_c('span',{staticClass:"c-disclosure-triangle c-tree__item__view-control",class:{
                                'c-disclosure-triangle--expanded': topic.expanded,
                                'is-enabled': topic.sessions.length
                            },on:{"click":function($event){topic.expanded = !topic.expanded;}}}),_vm._v(" "),_c('div',{staticClass:"c-object-label c-tree__item__label",on:{"click":function($event){return _vm.select(topic)}}},[_c('span',{staticClass:"c-tree__item__type-icon c-object-label__type-icon icon-topic"}),_vm._v(" "),_c('div',{staticClass:"c-tree__item__name c-object-label__name"},[_vm._v("\n                                "+_vm._s(topic.data.topic)+"\n                            ")])])]),_vm._v(" "),_c('span',{directives:[{name:"show",rawName:"v-show",value:(topic.expanded),expression:"topic.expanded"}],staticClass:"c-tree__item__subtree"},[_c('ul',{staticClass:"c-tree"},_vm._l((topic.sessions),function(session,index){return _c('li',{key:index,staticClass:"c-tree__item-h"},[_c('span',{staticClass:"c-tree__item",class:{ 'is-selected': session.selected },on:{"click":function($event){return _vm.select(session)}}},[_c('div',{staticClass:"c-object-label c-tree__item__label"},[_c('span',{staticClass:"c-tree__item__type-icon c-object-label__type-icon icon-session"}),_vm._v(" "),_c('div',{staticClass:"c-tree__item__name c-object-label__name"},[_vm._v("\n                                            "+_vm._s(session.data.number)+"\n                                        ")])])])])}),0)])])}),0)]),_vm._v(" "),_c('div',{staticClass:"c-overlay__button-bar"},[_c('button',{staticClass:"c-button c-button--major",class:{ disabled: !_vm.selection },on:{"click":function($event){return _vm.setActiveTopicOrSession()}}},[_vm._v("\n                Connect\n            ")]),_vm._v(" "),_c('button',{staticClass:"c-button",on:{"click":function($event){return _vm.cancel()}}},[_vm._v("\n                Cancel\n            ")])])]],2)},
staticRenderFns: [function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-overlay__top-bar"},[_c('div',{staticClass:"c-overlay__dialog-title"},[_vm._v("Loading Real-time Data Sources...")])])},function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-overlay__contents-main c-hss__view-wrapper"},[_c('div',{staticClass:"wait-spinner"})])},function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"c-overlay__top-bar"},[_c('div',{staticClass:"c-overlay__dialog-title"},[_vm._v("Select Real-time Data Source")])])}],
    inject: [
        'openmct'
    ],
    data() {
        return {
            isLoading: true,
            selection: undefined,
            topics: [],
            modelStore: []
        }
    },
    mounted() {
        this.sessionService = SessionService();
        this.loadSessions();

        this.openOverlay();
    },
    methods: {
        select(model) {
            this.modelStore.forEach(otherModel => {
                otherModel.selected = false;
            });

            model.selected = true;

            this.selection = model;
        },
        setActiveTopicOrSession() {
            this.sessionService.setActiveTopicOrSession(this.selection.data);

            this.closeOverlay();
        },
        cancel() {
            this.closeOverlay();
        },
        loadSessions() {
            this.isLoading = true;
            this.selection = undefined;
            this.topics = [];
            this.modelStore = [];

            this.sessionService
                .getTopicsWithSessions()
                .then(topics => {
                    this.topics = topics.map(this.topicAsModel);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        topicAsModel(topic) {
            const sessions = topic.sessions.map(session => this.sessionAsModel(session));
            const isSessionSelected = sessions.some(session => session.selected);

            const topicModel = {
                selected: this.sessionService.isActiveTopic(topic) && !isSessionSelected,
                data: topic,
                expanded: isSessionSelected,
                sessions
            };

            if (topicModel.selected) {
                this.selection = topicModel;
            }

            this.modelStore.push(topicModel);

            return topicModel;
        },
        sessionAsModel(session) {
            const sessionModel = {
                selected: this.sessionService.isActiveSession(session),
                data: session
            };

            if (sessionModel.selected) {
                this.selection = sessionModel;
            }

            this.modelStore.push(sessionModel);

            return sessionModel;
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
        },
        closeOverlay() {
            if (this.overlay) {
                this.overlay.dismiss();
                delete this.overlay;
            }
        }
    }
};

var RealtimeSessionIndicator = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"h-indicator"},[_c('div',{staticClass:"c-indicator icon-topic",class:{
            's-status-on': _vm.hasActiveSession,
            's-status-available': _vm.hasTopics && !_vm.hasActiveSession
        }},[(_vm.realtimeSessionDisabled)?_c('span',{staticClass:"c-indicator__label"},[_vm._v("Real-time Disabled in Config")]):_c('span',{staticClass:"c-indicator__label"},[(_vm.hasActiveSession)?_c('span',[_vm._v("\n                Connected to\n                "+_vm._s(_vm.activeSession.topic)+"\n                "+_vm._s(_vm.activeSession.number)+"\n                "),_c('button',{on:{"click":function($event){return _vm.openSessionSelector()}}},[_vm._v("Change")]),_vm._v(" "),_c('button',{on:{"click":function($event){return _vm.disconnect()}}},[_vm._v("Disconnect")])]):_vm._e(),_vm._v(" "),(_vm.hasTopics && !_vm.hasActiveSession)?_c('span',[_vm._v("\n                Real-time Available\n                "),_c('button',{on:{"click":function($event){return _vm.openSessionSelector()}}},[_vm._v("\n                    Select\n                ")])]):_vm._e(),_vm._v(" "),(!_vm.hasTopics && !_vm.hasActiveSession)?_c('span',[_vm._v("\n                Real-time Not Available\n            ")]):_vm._e()])]),_vm._v(" "),(_vm.showSessionSelector)?_c('RealtimeSessionSelector',{on:{"close-session-selector":_vm.closeSessionSelector}}):_vm._e()],1)},
staticRenderFns: [],
    components: {
        RealtimeSessionSelector
    },
    inject: [
        'openmct'
    ],
    data() {
        return {
            hasTopics: undefined,
            activeSession: undefined,
            showSessionSelector: false,
            realtimeSessionDisabled: undefined
        }
    },
    mounted() {
        this.sessionService = SessionService();
        this.realtimeSessionDisabled = this.sessionService.realtimeSessionConfig.disable;
        this.activeSession = this.sessionService.getActiveTopicOrSession();
        this.stopListening = this.sessionService.listen(this.onActiveSessionChange);

        this.pollForSessions();
    },
    beforeDestroy() {
        this.stopListening?.();
    },
    computed: {
        hasActiveSession() {
            return this.activeSession !== undefined;
        }
    },
    methods: {
        pollForSessions() {
            if (!this.activeSession) {
                this.sessionService
                    .getTopicsWithSessions()
                    .then(topics => {
                        this.hasTopics = topics.length > 0;
                    });
            }

            if (this.activeTimeout) {
                clearTimeout(this.activeTimeout);
            }

            this.activeTimeout =
                setTimeout(() => {
                    this.pollForSessions();
                }, 15000);
        },
        disconnect() {
            this.sessionService.setActiveTopicOrSession(undefined);
        },
        onActiveSessionChange(session) {
            this.activeSession = session;
            this.pollForSessions();
        },
        openSessionSelector() {
            this.showSessionSelector = true;
        },
        closeSessionSelector() {
            this.showSessionSelector = false;
        },
    }
};

function plugin(vistaTime) {
    return function install(openmct) {
        let indicator = {
            element: document.createElement('div'),
            priority: -4
        };

        openmct.indicators.add(indicator);
        openmct.on('start', () => {
            new Vue ({
                el: indicator.element,
                provide: {
                    openmct
                },
                components: {
                    RealtimeSessionIndicator
                },
                template: '<RealtimeSessionIndicator />'
            });
        });
    };
}

export { plugin as default };
