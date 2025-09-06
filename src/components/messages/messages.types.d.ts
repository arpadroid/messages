import { MessageResource, MessageResourceConfigType } from '@arpadroid/resources';
import { MessageConfigType } from '../message/message.js';
import { ListConfigType } from '@arpadroid/lists';

export type MessagesConfigType = ListConfigType & {
    messages?: MessageConfigType[];
    messenger?: MessageResource;
    resourceConfig?: MessageResourceConfigType;
    prependNewMessages?: boolean;
};
