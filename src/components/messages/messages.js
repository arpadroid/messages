/**
 * @typedef {import('./messages.types').MessagesConfigType} MessagesConfigType
 * @typedef {import('../message/message.types').MessageConfigType} MessageConfigType
 * @typedef {import('../message/message.js').default} Message
 * @typedef {import('@arpadroid/resources').ListResourceItemType} MessageType
 * @typedef {import('@arpadroid/tools').AbstractContentInterface} AbstractContentInterface
 */
import { attrString, defineCustomElement, mergeObjects, renderNode } from '@arpadroid/tools';
import { List } from '@arpadroid/lists';

const html = String.raw;
class Messages extends List {
    //////////////////////////
    // #region INITIALIZATION
    /////////////////////////
    /**
     * Returns default config.
     * @returns {MessagesConfigType}
     */
    getDefaultConfig() {
        /** @type {MessagesConfigType} */
        const config = {
            className: 'arpaMessages',
            renderMode: 'minimal',
            hasResource: true,
            prependNewMessages: true
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }
    // #endregion

    ////////////////////
    // #region ACCESSORS
    ////////////////////

    getMessageTypes() {
        return ['arpa', 'info', 'success', 'warning', 'error'];
    }

    /**
     * Adds a message to the messenger.
     * @param {MessageType} message
     * @param {boolean} prepend
     * @returns {MessageType | undefined}
     */
    addMessage(message, prepend = this.getProperty('prependNewMessages') ?? true) {
        return this.listResource?.addItem(message, true, prepend);
    }

    /**
     * Adds messages to the messenger.
     * @param {MessageType[]} messages
     * @returns {Messages}
     */
    addMessages(messages) {
        this.listResource?.addItems(messages);
        return this;
    }

    /**
     * Deletes a message from the messenger.
     * @param {MessageType} message
     * @returns {Messages}
     */
    deleteMessage(message) {
        this.listResource?.removeItem(message);
        return this;
    }

    deleteMessages() {
        return this.listResource?.removeItems();
    }

    // #endregion

    ////////////////////////////
    // #region MESSAGE TYPES
    ///////////////////////////
    /**
     * Adds an info message.
     * @param {AbstractContentInterface} message
     * @param {MessageType} config
     * @returns {MessageType | undefined}
     */
    info(message, config = {}) {
        config.content = message;
        config.type = 'info';
        return this.addMessage(config);
    }

    /**
     * Adds an error message.
     * @param {AbstractContentInterface} message
     * @param {MessageType} config
     * @returns {MessageType | undefined}
     */
    error(message, config = {}) {
        config.content = message;
        config.type = 'error';
        return this.addMessage(config);
    }

    /**
     * Adds an warning message.
     * @param {AbstractContentInterface} message
     * @param {MessageType} config
     * @returns {MessageType | undefined}
     */
    warning(message, config = {}) {
        config.content = message;
        config.type = 'warning';
        return this.addMessage(config);
    }

    /**
     * Adds an success message.
     * @param {AbstractContentInterface} message
     * @param {MessageType} config
     * @returns {MessageType | undefined}
     */
    success(message, config = {}) {
        config.content = message;
        config.type = 'success';
        return this.addMessage(config);
    }

    /**
     * Creates a list item via class instantiation.
     * @param {MessageConfigType} config
     * @param {Record<string,unknown>} payload
     * @param {Record<string,unknown>} mapping
     * @returns {Message | HTMLElement}
     * @throws {Error} If the list item component is not defined.
     */
    createItem(config = {}, payload = this.getDefaultItemPayload(config.id || ''), mapping = {}) {
        if (payload.node instanceof HTMLElement) return payload.node;
        const { type = 'info', content = '' } = config;
        const messageHTML = html`<${type}-message ${attrString(config)}>${content}</${type}-message>`;
        const item = /** @type {Message} */ (renderNode(messageHTML));
        payload && (item.payload = payload);
        mapping && (item.map = mapping);
        this.listResource && this.preProcessNode(item);
        return item;
    }

    // #endregion
}

defineCustomElement('arpa-messages', Messages);

export default Messages;
