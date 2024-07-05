import { ListItemInterface } from '@arpadroid/lists/src/listItem/listItemInterface.d.ts';

export interface MessageInterface extends ListItemInterface {
    text?: string;
    timeout?: number;
    canClose?: boolean;
    closeLabel?: string;
    icon?: string;
    truncateContent?: boolean;
    onClose?: () => void;
}
