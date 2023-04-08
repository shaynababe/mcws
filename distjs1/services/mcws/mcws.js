import NamespaceMIO from './NamespaceMIO.js';
import DataTableMIO from './DataTableMIO.js';
import OpaqueFileMIO from './OpaqueFileMIO.js';
import client from './MCWSClient.js';
import './MIO.js';
import './MCWSParameters.js';

class MCWS {
    constructor() {
        window.mcws = this;
    }

    configure(config) {
        client.configure(config);
    }

    namespace(name) {
        return new NamespaceMIO(name);
    }

    dataTable(name) {
        return new DataTableMIO(name);
    }

    opaqueFile(name) {
        return new OpaqueFileMIO(name);
    }
}

const mcws = new MCWS();

export { mcws as default };
