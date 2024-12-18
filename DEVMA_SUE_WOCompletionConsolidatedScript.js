/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/format'],
    
    (format) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        function setDefaultExpirationDate(context){

                const newRec = context.newRecord
                const inventorydetailSubRec = newRec.getSubrecord({fieldId:'inventorydetail'});
                const inventorydetailLineCount = inventorydetailSubRec.getLineCount({sublistId: 'inventoryassignment'});
                log.debug('inventorydetailLineCount', inventorydetailLineCount);
                let dateValue = new Date();
                dateValue.setFullYear(dateValue.getFullYear()+2);

                let dateFormattedToNS = format.format({
                        value: dateValue,
                        type: format.Type.DATE
                });
                dateValue = new Date(dateFormattedToNS);
                log.debug('dateValue', dateValue);
                for (let i = 0; i <inventorydetailLineCount; i++){
                        const currentExpirationDate = inventorydetailSubRec.getSublistValue({sublistId: 'inventoryassignment', fieldId: 'expirationdate', line:i});
                        if (currentExpirationDate===null || currentExpirationDate===''){
                                inventorydetailSubRec.setSublistValue({sublistId:'inventoryassignment',fieldId:'expirationdate',line:i,value:dateValue});
                        }
                }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
                if (scriptContext.type=='create' ||  scriptContext.type=='edit'){
                        setDefaultExpirationDate(scriptContext);
                }

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return {beforeSubmit}

    });
