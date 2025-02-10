import { MessageResource, MessageResourceConfigType } from '@arpadroid/resources';
import { MessageConfigType } from '../message/message.js';
import { ArpaElementConfigType } from '@arpadroid/ui';

export type MessagesConfigType = ArpaElementConfigType & {
    messages?: MessageConfigType[];
    messenger?: MessageResource;
    resourceConfig?: MessageResourceConfigType;
};
