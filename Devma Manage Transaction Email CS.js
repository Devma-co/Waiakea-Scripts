/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 * 
 * Description: This Client Script updates the "To Be Emailed" checkbox field (`tobeemailed`) on Invoice and Cash Sale records 
 * based on the value of the custom field "Manage Email Send" (`custbody_devma_manage_email_send`).
 * During the creation or copying of an Invoice or Cash Sale, it automatically sets the "To Be Emailed" field to `true` 
 * if the "Manage Email Send" field is `true`, or `false` if the custom field is `false`.
 * 
 * Owner: Nazish Ansari
 */
 
define(['N/currentRecord', 'N/record', 'N/search'],
    function (currentRecord, record, search) {
        function pageInit(context) {
          log.debug('context.fieldId',context.mode)
             if ( context.mode === "copy" || context.mode === "create") {
                setDefaultValue(context);
			 }
        }
        function setDefaultValue(context) {
            try {
                var rec = context.currentRecord;
               var manageEmail = rec.getValue('custbody_devma_manage_email_send');
				log.debug('manageEmail',manageEmail)
                if (manageEmail == true) {
                  log.debug('inside cond','')
                    rec.setValue('tobeemailed',true)
                }else{
                  rec.setValue('tobeemailed',false) 
                }
            }
            catch (e) {
                log.debug(e.name, e.message);
            }
        }
        return {
           // fieldChanged: fieldChanged,
            pageInit: pageInit
        };
    });
