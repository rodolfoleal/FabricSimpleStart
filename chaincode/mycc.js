import shim from 'fabric-shim';
import StubUtils from './util/stub-utils';

class Chaincode {

    async Init(stub){

        try {

            let args = stub.getFunctionAndParameters();
            console.log(args);
            return StubUtils.success('Initialized Successfully!');

        } catch(error) {
            console.log("Erro...");

            return StubUtils.error(error.message);
        }

    }

    async Invoke(stub){

        try {

            let ret = stub.getFunctionAndParameters();
            
            let fcn = this[ret.fcn];

            if(fcn) {

                console.log(JSON.stringify(ret));
                let request = ret.params[0] ? JSON.parse(ret.params[0]) : {};
                
                return fcn(stub, request);

            } else {

                throw new Error('This function ', ret.fcn, ' doesn\'t exist.');
            }

        } catch (error) {

            return StubUtils.error(error.message);
        }
    }


    async createTitulo(stub, request) {

        try {
            
            request.id = stub.getTxID();

            await StubUtils.putState(stub, request.id, request);
    
            return StubUtils.success(request.id);

        } catch(error) {

            return StubUtils.error(error.message);
        }
    }

    async findTituloById(stub, request) {

        try {

            let result = await stub.getState(stub, request.id);
    
            return StubUtils.success(result);

        } catch(error) {

            return StubUtils.error(error.message);
        }
    }

}

shim.start(new Chaincode());