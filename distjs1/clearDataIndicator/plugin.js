import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import { M as Moment } from '../moment-83aaf3a7.js';
import '../_commonjsHelpers-76cdd49e.js';

var ClearDataIndicator = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"h-indicator"},[_c('div',{class:[
            'c-indicator',
            'c-indicator--clickable',
            's-status-caution',
            _vm.globalStalenessMessage ? 'icon-database' : 'icon-clear-data'
        ]},[_c('span',{staticClass:"label c-indicator__label"},[_vm._v("\n            "+_vm._s(_vm.globalStalenessMessage)+"\n            "),_c('button',{on:{"click":_vm.clearData}},[_vm._v("\n                Clear Data\n            ")])])])])},
staticRenderFns: [],
    inject: [
        'openmct',
        'globalStalenessMs'
    ],
    data() {
        return {
            globalStalenessMessage: ''
        }
    },
    methods: {
        formatTimestamp(ms) {
            let duration = Moment.duration(ms, 'milliseconds');
            let hours = this.padTime(Math.floor(duration.asHours()));
            let minutes = this.padTime(Math.floor(duration.minutes()));
            let seconds = this.padTime(Math.floor(duration.seconds()));
            let formattedTimestamp = `${hours}:${minutes}:${seconds}`;

            return formattedTimestamp;
        },
        padTime(time) {
            if (time < 10) {
                return `0${time}`
            } else {
                return `${time}`
            }
        },
        clearData() {
            this.openmct.objectViews.emit('clearData');
            this.openmct.notifications.info('Data Cleared On All Displays');
        }
    },
    mounted() {
        if (this.globalStalenessMs) {
            let formattedTimestamp = this.formatTimestamp(this.globalStalenessMs);
            this.globalStalenessMessage = `Data stale after ${formattedTimestamp}`;
        }
    }
};

function plugin(globalStalenessMs) {
    return function install(openmct) {
        let indicator = {
            element: document.createElement('div')
        };

        openmct.indicators.add(indicator);
        openmct.on('start', () => {
            new Vue ({
                el: indicator.element,
                provide: {
                    openmct,
                    globalStalenessMs
                },
                components: {
                    ClearDataIndicator
                },
                template: '<ClearDataIndicator />'
            });
        });
    };
}

export { plugin as default };
