export default (function(){

    return {

        /**
         * Convert a string into a Buffer.
         * 
         * @param {*} message - Message
         */
        from: function(message) {
    
            return Buffer.from(message);
        },

        /**
         * Convert a json object into a Buffer.
         * 
         * @param {*} json - Json or Array of json
         */
        fromJson: function(json) {
    
            return Buffer.from(JSON.stringify(json));
        },
    
        /**
         * Convert a Buffer into a json object.
         * 
         * @param {*} buffer - Buffer
         * @param {*} isArray - Parâmetro que diz se retorno deve ser em array, caso não exista resultado.
         */
        toJson: function(buffer, isArray = false) {
    
            try{
                
                if(buffer && buffer.length > 0) {
                    
                    return JSON.parse(buffer);
                }
    
            } catch(error) {
    
                console.error(error);
            }
    
            return undefined;
        }
    }
})();