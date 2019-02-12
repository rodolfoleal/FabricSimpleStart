import shim from 'fabric-shim';
import BufferUtils from './buffer-utils';

export default (function(){

    return {

        putState: async function(stub, key, value){

            let newValue = value ? value : [];

            let bufferedValue = BufferUtils.fromJson(newValue);

            await stub.putState(key, bufferedValue);
        },

        getState: async function(stub, key){

            console.log("key:"+key);
            let value = await stub.getState(key);
            console.log("onze:"+value);

            let jsonValue = BufferUtils.toJson(value);
            console.log("jsonValue:"+jsonValue);

            return jsonValue;
        },

        getQueryResult: async function(stub, query) {

            let value = await stub.getQueryResult(query);

            return value;
        },

        getHistoryForKey: async function(stub, key) {

            let value = await stub.getHistoryForKey(key);

            return value;
        },

        success: async function(message){

            return typeof message === 'string' ?
                        shim.success(BufferUtils.from(message)) :
                            shim.success(BufferUtils.fromJson(message));
        },

        /**
         * Method which return result with success
         * 
         * @param {*} message - Result message
         */
        error: async function(message){

            return typeof message === 'string' ?
                        shim.error(message) :
                            shim.error(message);
        }
    }
})();