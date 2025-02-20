import Message from '../message/message.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';

class InfoMessage extends Message {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'info'
        });
    }
}

defineCustomElement('info-message', InfoMessage);

export default InfoMessage;
