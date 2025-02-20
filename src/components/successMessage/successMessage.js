import Message from '../message/message.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';

class SuccessMessage extends Message {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'check_circle'
        });
    }
}

defineCustomElement('success-message', SuccessMessage);

export default SuccessMessage;
