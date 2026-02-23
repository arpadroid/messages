import { ListResource, ListResourceConfigType } from '@arpadroid/resources';
import { MessageConfigType } from '../message/message.js';
import { ListConfigType } from '@arpadroid/lists';

export type MessagesConfigType = ListConfigType & {
    messages?: MessageConfigType[];
    messenger?: ListResource;
    resourceConfig?: ListResourceConfigType;
    prependNewMessages?: boolean;
};
