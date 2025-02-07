import { ListItemConfigType } from '../../types.compiled';

export interface MessageInterface extends ListItemConfigType {
    text?: string;
    timeout?: number;
    canClose?: boolean;
    closeLabel?: string;
    icon?: string;
    truncateContent?: boolean;
    onClose?: () => void;
}
