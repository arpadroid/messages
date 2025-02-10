/**
 * @typedef {import('./messages.types').MessagesConfigType} MessagesConfigType
 * @typedef {import('../message/message.types').MessageConfigType} MessageConfigType
 * @typedef {import('../message/message.js').default} Message
 * @typedef {import('@arpadroid/resources').MessageType} MessageType
 */
import { mergeObjects } from '@arpadroid/tools';
import { MessageResource } from '@arpadroid/resources';
import { ArpaElement } from '@arpadroid/ui';

class Messages extends ArpaElement {
    messagesById = {};
    messagesByText = {};
    messagesByType = {};

    //////////////////////////
    // #region INITIALIZATION
    /////////////////////////
    /**
     * Returns default config.
     * @returns {MessagesConfigType}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            messages: [],
            resourceConfig: {},
            prependNewMessages: true
        });
    }

    _initialize() {
        this.bind('onResourceAddMessage');
        const id = this.getProperty('id');
        if (!id) {
            throw new Error('Messages must have an id.');
        }
        this._initializeResource();
    }

    _initializeResource() {
        if (!this.resource) {
            const id = this.getProperty('id');
            /** @type { MessageResource } */
            this.resource = new MessageResource({ id });
            this.resource.on('delete_message', (/** @type {MessageConfigType} */ message) =>
                message?.node?.remove()
            );
            this.resource.on('delete_messages', () => (this.innerHTML = ''));
            this.resource.on('add_message', this.onResourceAddMessage);
        }
    }

    // #endregion

    ///////////////////////////
    // #region RESOURCE EVENTS
    //////////////////////////
    /**
     * Handles the add_message event from the resource.
     * @param {MessageConfigType} message
     */
    onResourceAddMessage(message) {
        const prependNewMessages = this.hasProperty('prepend-new-messages');
        let { type = 'arpa' } = message;
        if (!this.getMessageTypes().includes(type)) {
            type = 'arpa';
        }
        /** @type {Message | null} */
        const node = /** @type {Message | null} */ (document.createElement(`${type}-message`));
        if (node) {
            message.node = node;
            node.setConfig(message);
            prependNewMessages ? this.prepend(node) : this.appendChild(node);
        }
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
     * @param {MessageConfigType} message
     * @returns {MessageType | undefined}
     */
    addMessage(message) {
        return this.resource?.addMessage(message);
    }

    /**
     * Adds messages to the messenger.
     * @param {MessageConfigType[]} messages
     * @returns {Messages}
     */
    addMessages(messages) {
        this.resource?.addMessages(messages);
        return this;
    }

    /**
     * Deletes a message from the messenger.
     * @param {MessageConfigType} message
     * @returns {Messages}
     */
    deleteMessage(message) {
        this.resource?.deleteMessage(message);
        return this;
    }

    deleteMessages() {
        return this.resource?.deleteMessages();
    }

    // #endregion
}

customElements.define('arpa-messages', Messages);

export default Messages;
