/**
 * @typedef {import('./message.types').MessageConfigType} MessageConfigType
 * @typedef {import('../messages/messages.js').default} MessagesComponent
 * @typedef {import('@arpadroid/ui').TruncateText} TruncateText
 */
import { defineCustomElement, listen, mergeObjects, render } from '@arpadroid/tools';
import { ListItem } from '@arpadroid/lists';
const html = String.raw;
class Message extends ListItem {
    ///////////////////////////////
    // #region Initialization
    //////////////////////////////

    /** @type {MessageConfigType} */
    _config = this._config;

    /**
     * Returns the default config.
     * @returns {MessageConfigType}
     */
    getDefaultConfig() {
        this.bind('_onTextClick', '_onClose');
        /** @type {MessageConfigType} */
        const config = {
            closeLabel: 'Close',
            classNames: ['message'],
            canClose: false,
            icon: 'chat_bubble',
            timeout: 0,
            truncateContent: 190,
            listSelector: 'arpa-messages'
        };

        return mergeObjects(super.getDefaultConfig(), config);
    }

    // #endregion

    //////////////////////////
    // #region Get
    /////////////////////////

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

    getTruncateTextNode() {
        return /** @type {TruncateText | null} */ (
            this.contentNode?.tagName === 'TRUNCATE-TEXT' ? this.contentNode : null
        );
    }

    // #endregion Get

    //////////////////////////
    // #region Has
    /////////////////////////

    hasReadMoreButton() {
        return this.getProperty('has-read-more-button');
    }

    hasTextToggle() {
        return !this.hasReadMoreButton() && this.truncateComponent;
    }

    canClose() {
        return this.hasAttribute('can-close') || this._config.canClose;
    }

    // #endregion

    ////////////////////////////
    // #region RENDERING
    ////////////////////////////

    renderRhs() {
        return super.renderRhs(this.renderCloseButton());
    }

    renderCloseButton() {
        const label = this.getProperty('close-label');
        return render(
            this.canClose(),
            html`<icon-button
                class="message__closeButton iconButton--mini"
                icon="close"
                variant="minimal"
                label="${label}"
            ></icon-button>`
        );
    }

    // #endregion

    /////////////////////////////
    // #region Lifecycle
    /////////////////////////////

    _onConnected() {
        super._onConnected();
        this.handleTimeout();
    }

    handleTimeout() {
        const timeout = this.getTimeout();
        if (timeout) {
            this.timeout = setTimeout(() => this.close(), timeout * 1000);
        }
    }

    async _initializeNodes() {
        await super._initializeNodes();
        /** @type {TruncateText | null} */
        this.truncateComponent = this.getTruncateTextNode();
        /** @type {HTMLElement | null} */
        this.closeButton = this.querySelector('.message__closeButton');
        this.closeButton && listen(this.closeButton, 'click', this._onClose);
        return true;
    }

    _onComplete() {
        if (this.hasTextToggle()) {
            this.mainNode?.setAttribute('role', 'button');
            this.mainNode?.setAttribute('tabindex', '0');
            this.mainNode?.setAttribute('aria-label', 'Read more');
            this._config.action = this._onTextClick;
        }
        super._onComplete();
        this.classList.add('message--open');
    }

    /**
     * When the text is clicked, it will toggle the truncate state.
     * @param {Event} event
     */
    _onTextClick(event) {
        const target = /** @type {HTMLElement} */ (event.target);
        const interactiveSelector = 'a, button, input, textarea, select';
        if (target?.closest(interactiveSelector)) {
            return;
        }
        this.truncateComponent?.toggleTruncate();
    }

    _onClose() {
        const { onClose } = this._config;
        typeof onClose === 'function' && onClose();
        this.close();
    }

    disconnectedCallback() {
        clearTimeout(this.timeout);
    }

    // #endregion Lifecycle

    //////////////////////////
    // #region API
    /////////////////////////

    async close() {
        this.classList.add('message--closing');
        setTimeout(() => {
            // @ts-ignore
            this.resource?.deleteMessage(this._config);
            this.remove();
        }, 800);
    }

    // #endregion
}

defineCustomElement('arpa-message', Message);

export default Message;
