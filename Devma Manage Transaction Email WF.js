/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript
 */
define(["N/record", "N/log", "N/https", "N/search", "N/format", "N/http", "N/runtime"], function(record, log, https, search, format, http, runtime) {
            function onAction(context) {
                try {
                    var newRecord = context.newRecord;
                    setToEmailOnRecord(context);
                    return 1;
                } catch (e) {
                    log.debug(e.name, e.message);
                }
            }

            function setToEmailOnRecord(context) {
                try {
                    var rec = context.newRecord;
                    var userObj = runtime.getCurrentUser();
                    log.debug("userObj", userObj);
                    var userId = userObj.id;
                    log.debug("userId", userId);
                   
                  	
                        
                   rec.setValue('custbody_devma_manage_email_send',true);
                   




                } catch (e) {
                    log.debug(e.name, e.message);
                }
            }

                return {
                    onAction: onAction
                };
            });