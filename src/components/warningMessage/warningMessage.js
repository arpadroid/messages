import Message from '../message/message.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';

class WarningMessage extends Message {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'warning'
        });
    }
}

defineCustomElement('warning-message', WarningMessage);

export default WarningMessage;
