import { ListItemConfigType } from '@arpadroid/lists';
import { MessageResource } from '@arpadroid/resources';

export type MessageConfigType = ListItemConfigType & {
    text?: string;
    timeout?: number;
    canClose?: boolean;
    closeLabel?: string;
    icon?: string;
    truncateContent?: boolean;
    type?: 'info' | 'success' | 'warning' | 'error';
    onClose?: () => void;
    node?: HTMLElement;
    resource?: MessageResource;
};
