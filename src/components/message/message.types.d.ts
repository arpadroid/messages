import { ListItemConfigType } from '@arpadroid/lists';
import { ListResource } from '@arpadroid/resources';

export type MessageConfigType = ListItemConfigType & {
    text?: string;
    timeout?: number;
    canClose?: boolean;
    closeLabel?: string;
    icon?: string;
    truncateContent?: number;
    type?: 'info' | 'success' | 'warning' | 'error' | 'arpa';
    onClose?: () => void;
    node?: HTMLElement;
    resource?: ListResource;
};
