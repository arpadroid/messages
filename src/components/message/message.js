/**
 * @typedef {import('./message.types').MessageConfigType} MessageConfigType
 * @typedef {import('../messages/messages.js').default} MessagesComponent
 * @typedef {import('@arpadroid/ui').TruncateText} TruncateText
 * @typedef {import('@arpadroid/ui').Button} Button
 */
import { defineCustomElement, listen, mergeObjects } from '@arpadroid/tools';
import { ListItem } from '@arpadroid/lists';

const html = String.raw;
class Message extends ListItem {
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
            truncateContent: 190,
            listSelector: 'arpa-messages',
            hasTextToggle: false,
            rhs: () =>
                html`<arpa-node
                    tag="icon-button"
                    name="closeButton"
                    class-names="iconButton--mini"
                    class-name="message__closeButton"
                    icon="close"
                    variant="minimal"
                    label="${this.getProp('closeLabel')}"
                    can-render="canClose"
                ></arpa-node>`
        };

        return mergeObjects(super.getDefaultConfig(), config);
    }

    //////////////////////////
    // #region Get
    /////////////////////////

    getTimeout() {
        return parseFloat(this.getProp('timeout'));
    }

    getContent() {
        return super.getContent() || this.getProp('text') || this.getI18nContent();
    }

    getI18nContent() {
        const i18nKey = this.getProp('i18n');
        return i18nKey ? html`<i18n-text key="${i18nKey}"></i18n-text>` : '';
    }

    getTruncateTextNode() {
        const { content } = this.nodes;
        return /** @type {TruncateText | null} */ (content?.tagName === 'TRUNCATE-TEXT' ? content : null);
    }

    canRenderRhs() {
        return super.canRenderRhs() || this.getProp('canClose');
    }

    $onConnected() {
        super.$onConnected();
        this.handleTimeout();
    }

    handleTimeout() {
        const timeout = this.getTimeout();
        if (timeout) {
            this.timeout = setTimeout(() => this.close(), timeout * 1000);
        }
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        /** @type {TruncateText | null} */
        this.truncateComponent = this.getTruncateTextNode();
        this.closeButtonComponent = /** @type {Button | null} */ (this.nodes.closeButton);
        this.closeButtonComponent?.promise.then(() => {
            this.closeButton = this.closeButtonComponent?.button;
            this.closeButton && listen(this.closeButton, 'click', this._onClose);
        });
        return true;
    }

    $onComplete() {
        if (this.hasProp('hasTextToggle')) {
            this.nodes.main?.setAttribute('role', 'button');
            this.nodes.main?.setAttribute('tabindex', '0');
            this.nodes.main?.setAttribute('aria-label', 'Read more');
            this.actions.add(this._onTextClick);
        }
        super.$onComplete();
        this.classList.add('message--open');
    }

    disconnectedCallback() {
        this.timeout && clearTimeout(this.timeout);
    }

    // #endregion Lifecycle

    async close() {
        this.classList.add('message--closing');
        setTimeout(() => {
            this.listResource?.removeItem({ id: this.id });
            this.remove();
        }, 800);
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
}

defineCustomElement('arpa-message', Message);

export default Message;
