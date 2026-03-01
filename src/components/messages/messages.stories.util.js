/**
 * @typedef {import('./messages.js').default} Messages
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { attrString } from '@arpadroid/tools';
import { within } from 'storybook/test';
const html = String.raw;

/**
 * Gets default args for messages stories.
 * @returns {Record<string, unknown>}
 */
export function getArgs() {
    return {
        prependNewMessages: false
    };
}

/**
 * Gets argTypes for messages stories.
 * @param {string} [category]
 * @returns {import('@storybook/web-components-vite').ArgTypes}
 */
export function getArgTypes(category = 'Messages Props') {
    return {
        prependNewMessages: { control: { type: 'boolean' }, table: { category } }
    };
}

/**
 * Creates shared test texts and labels.
 * @returns {{
 *   messageText: string,
 *   infoText: string,
 *   successText: string,
 *   warningText: string,
 *   errorText: string,
 *   newMessageText: string,
 *   anotherNewMessageText: string,
 *   closeLabel: string
 * }}
 */
export function createTestLinks() {
    return {
        messageText: 'This is a test message',
        infoText: 'This is an info message',
        successText: 'This is a success message',
        warningText: 'This is a warning message',
        errorText: 'This is an error message',
        newMessageText: 'This is a new message',
        anotherNewMessageText: 'This is another new message',
        closeLabel: 'Close'
    };
}

/**
 * Sets up the messages story test canvas and component node.
 * @param {HTMLElement} canvasElement
 * @returns {Promise<{
 *   canvas: ReturnType<typeof within>,
 *   messages: Messages | null
 * }>}
 */
export async function playSetup(canvasElement) {
    const canvas = within(canvasElement);
    await customElements.whenDefined('arpa-messages');
    const messages = /** @type {Messages | null} */ (canvasElement.querySelector('arpa-messages'));
    // await messages?.promise;
    return { canvas, messages };
}

/**
 * Renders a message component with the given args and story context.
 * @param {Args} args
 * @param {import('@storybook/web-components-vite').StoryContext} _story
 * @returns {string}
 */
export function renderMessages(args, _story) {
    delete args.text;
    return html`
        <arpa-messages id="messages" ${attrString(args)}>
            <arpa-message text="This is a test message" can-close truncate-content="30"></arpa-message>
            <info-message text="This is an info message" can-close></info-message>
            <success-message text="This is a success message" can-close></success-message>
            <warning-message text="This is a warning message" can-close></warning-message>
            <error-message text="This is an error message" can-close></error-message>
        </arpa-messages>
    `;
}
