import { V as Vue } from '../vue.runtime.esm-15b08281.js';
import FrameWatchTableConfiguration from './FrameWatchTableConfiguration.js';
import TableConfigurationComponent from 'openmct.tables.components.TableConfiguration';
import 'openmct.tables.TelemetryTableConfiguration';
import './config.js';
import '../_commonjsHelpers-76cdd49e.js';

class FrameWatchConfigurationViewProvider {
    constructor(key, name, type) {
        this.key = key;
        this.name = name;
        this.type = type;
    }

    canView(selection) {
        if (selection.length === 0) {
            return false;
        }
        let object = selection[0][0].context.item;
        return object && object.type === this.type;
    }

    view(selection) {
        let component;
        let domainObject = selection[0][0].context.item;
        const tableConfiguration = new FrameWatchTableConfiguration(domainObject, openmct, this.type);

        return {
            show: function (element) {
                component = new Vue({
                    provide: {
                        openmct,
                        tableConfiguration
                    },
                    components: {
                        TableConfiguration: TableConfigurationComponent
                    },
                    template: '<table-configuration></table-configuration>',
                    el: element
                });
            },
            destroy: function () {
                component.$destroy();
                component = undefined;
            }
        }
    }

    priority() {
        return 1;
    }
}

export { FrameWatchConfigurationViewProvider as default };
