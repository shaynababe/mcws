import { V as Vue } from '../vue.runtime.esm-15b08281.js';

const UTC_DEFAULT_FORMAT = openmctMCWSConfig.time.utcFormat;
var RealtimeIndicator = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"h-indicator"},[_c('div',{staticClass:"c-indicator icon-clock",class:_vm.cssClass},[_c('span',{staticClass:"label c-indicator__label"},[_vm._v(_vm._s(_vm.currentValue.text))])])])},
staticRenderFns: [],
    inject: [
        'openmct',
        'vistaTime'
    ],
    data() {
        return {
            currentValue: {
                text: 'Last real-time display update: never', 
                cssClass: ''
            },
        }
    },
    methods: {
        isRefreshRateNominal(newTimestamp, lastTimestamp) {
            if (newTimestamp - lastTimestamp <= 100) {
                return true;
            }
            return false;
        },
        setTick() {
            try {
                let timestamp = new Date();
                if (this.isRefreshRateNominal(timestamp, this.lastTimestamp)) {
                    this.currentValue = {
                        text: 'Data Rate is higher than 10hz, display may update less than once per second',
                        cssClass: 's-status-caution'
                    };
                } else {
                    let formattedTimestamp =  this.format.format(new Date());

                    this.currentValue = {
                        text: 'Last real-time display update: ' + formattedTimestamp,
                        cssClass: 's-status-on'
                    };
                };
                this.lastTimestamp = timestamp;
            } catch (e) {
                // don't break.
            }
        }
    },
    computed: {
        cssClass() {
            let className = this.currentValue['cssClass'];
            let classObject = {};
            classObject[className] = className.length > 0;
            return classObject;
        }
    },
    mounted() {
            this.lastTimestamp = new Date();
            this.format = this.openmct.telemetry.getFormatter(UTC_DEFAULT_FORMAT);

            if (this.vistaTime.ladClocks.ert) {
                this.vistaTime.ladClocks.ert.on('tick', this.setTick.bind(this));
            }
    },
    beforeDestroy() {
        if (this.vistaTime.ladClocks.ert) {
            this.vistaTime.ladClocks.ert.off('tick', this.setTick.bind(this));
        }
    }
};

function plugin(vistaTime) {
    return function install(openmct) {
        let indicator = {
            element: document.createElement('div'),
            priority: -5
        };

        openmct.indicators.add(indicator);
        openmct.on('start', () => {
            new Vue ({
                el: indicator.element,
                provide: {
                    openmct,
                    vistaTime
                },
                components: {
                    RealtimeIndicator
                },
                template: '<RealtimeIndicator />'
            });
        });
    };
}

export { plugin as default };
