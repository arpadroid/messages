import Message from '../message/message.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';

class ErrorMessage extends Message {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'report'
        });
    }
}

defineCustomElement('error-message', ErrorMessage);

export default ErrorMessage;
