/**
 * Copyright (c) All rights reserved.
 *
 * @NApiVersion 2.1
 * @NScriptType usereventscript
 */
define(['N/record', './Devma_WK_AutoFillTOCostByLocationCS'], function (record, AutoFillTOCostByLocationCS) {

    function beforeSubmit(context) {
        if (context.type !== context.UserEventType.CREATE && context.type !== context.UserEventType.EDIT) {
            return;
        }

        adjustLineCosts(context.newRecord);
    }

    function adjustLineCosts(currentRecord) {
        let sublistId = 'item';

        for (let line = 0; line < currentRecord.getLineCount({ sublistId }); line++) {
            let cost = AutoFillTOCostByLocationCS.getCost(
                currentRecord.getSublistValue({ sublistId, fieldId: 'item', line }),
                currentRecord.getValue({ fieldId: 'location' }));
            if (cost != null) {
                currentRecord.setSublistValue({ sublistId, fieldId: 'rate', value: cost, line });
            }
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };

});
