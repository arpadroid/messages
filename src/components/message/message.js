/**
 * @typedef {import('./message.types').MessageConfigType} MessageConfigType
 * @typedef {import('@arpadroid/resources').MessageResource} MessageResource
 * @typedef {import('../messages/messages.js').default} MessagesComponent
 */
import { mergeObjects, render } from '@arpadroid/tools';
import { ListItem } from '@arpadroid/lists';
const html = String.raw;
class Message extends ListItem {
    /** @type {MessageConfigType} */ // @ts-ignore
    _config = this._config;
    /////////////////////////
    // #region INITIALIZATION
    /////////////////////////
    /**
     * Returns the default config.
     * @returns {MessageConfigType}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            closeLabel: 'Close',
            canClose: false,
            icon: 'chat_bubble',
            timeout: 0,
            truncateContent: 190,
            listSelector: 'arpa-messages'
        });
    }

    initializeProperties() {
        super.initializeProperties();
        this._onClose = this._onClose.bind(this);
        /** @type {MessagesComponent | null} */
        this.messagesComponent = this.closest('arpa-messages');
        /** @type {MessageResource} */
        this.resource = this._config.resource ?? this.messagesComponent?.resource;
        return true;
    }

    // #endregion

    ////////////////////
    // #region ACCESSORS
    ////////////////////

    canClose() {
        return this.hasAttribute('can-close') || this._config.canClose;
    }

    close() {
        if (this.resource) {
            this.resource.deleteMessage(this._config);
        } else {
            this.remove();
        }
    }

    getTimeout() {
        return parseFloat(this.getProperty('timeout'));
    }

    getContent() {
        return super.getContent() || this.getProperty('text') || this.getI18nContent();
    }

    getI18nContent() {
        const i18nKey = this.getProperty('i18n');
        return i18nKey ? html`<i18n-text key="${i18nKey}"></i18n-text>` : '';
    }

    // #endregion

    ////////////////////
    // #region RENDERING
    ////////////////////

    renderRhs() {
        return super.renderRhs(this.renderCloseButton());
    }

    renderCloseButton() {
        const label = this.getProperty('close-label');
        return render(
            this.canClose(),
            html`<button
                is="icon-button"
                class="message__closeButton"
                icon="close"
                variant="minimal"
                label="${label}"
            ></button>`
        );
    }

    // #endregion

    /////////////////////
    // #region LIFECYCLE
    /////////////////////

    _onConnected() {
        this.classList.add('message');
        super._onConnected();
        this._initializeMessage();
        this.handleTimeout();
    }

    async _initializeNodes() {
        super._initializeNodes();
        this.closeButton = this.querySelector('.message__closeButton');
        this.closeButton?.removeEventListener('click', this._onClose);
        this.closeButton?.addEventListener('click', this._onClose);
    }

    _initializeMessage() {
        const message = this.resource?.registerMessage(this._config, this);
        if (message) {
            // @ts-ignore
            this._config.id = message.id;
            this._config.node = message.node;
        }
    }

    handleTimeout() {
        const timeout = this.getTimeout();
        if (timeout) {
            this.timeout = setTimeout(() => this.close(), timeout * 1000);
        }
    }

    disconnectedCallback() {
        clearTimeout(this.timeout);
    }

    // #endregion

    _onClose() {
        const { onClose } = this._config;
        if (typeof onClose === 'function') {
            onClose();
        }
        this.close();
    }
}

customElements.define('arpa-message', Message);

export default Message;
