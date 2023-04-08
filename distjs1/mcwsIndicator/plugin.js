import { M as MCWSIndicator } from '../MCWSIndicator-06832ac8.js';
import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import 'services/mcws/mcws';

function MCWSIndicatorPlugin() {
    return function install(openmct) {
        const mcwsIndicator = new Vue ({
            components: {
                MCWSIndicator
            },
            provide: {
                openmct: openmct
            },
            template: '<MCWSIndicator />'
        });

        openmct.indicators.add({
            key: 'mcws-indicator',
            element: mcwsIndicator.$mount().$el,
            priority: -3
        });
    };
}

export { MCWSIndicatorPlugin as default };
