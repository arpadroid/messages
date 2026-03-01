/**
 * @typedef {import('../message.js').default} MessageComponent
 * @typedef {import('../message.types').MessageConfigType} MessageConfigType
 */

import { within } from 'storybook/test';
import { HistoryOfComputing } from './templates.js';
import { attrString } from '@arpadroid/tools';

const html = String.raw;

/**
 * Gets default args for message stories.
 * @returns {MessageConfigType}
 */
export function getArgs() {
    return {
        canClose: false,
        closeLabel: undefined,
        timeout: 0,
        text: HistoryOfComputing,
        truncateContent: 190
    };
}

/**
 * Gets argTypes for message stories.
 * @param {string} [category]
 * @returns {import('@storybook/web-components-vite').ArgTypes}
 */
export function getArgTypes(category = 'Message Props') {
    return {
        text: {
            control: { type: 'text' },
            table: { category }
        },
        canClose: { control: { type: 'boolean' }, table: { category } },
        closeLabel: { control: { type: 'text' }, table: { category } },
        icon: { control: { type: 'text' }, table: { category } },
        timeout: { control: { type: 'number' }, table: { category } },
        truncateContent: { control: { type: 'number' }, table: { category } }
    };
}

/**
 * Creates shared test strings and labels.
 * @param {number} [truncateContent]
 * @returns {{
 *   longMessage: string,
 *   truncatedMessage: string,
 *   readMoreLabel: string,
 *   closeLabel: string
 * }}
 */
export function createTestLinks(truncateContent = 30) {
    const longMessage = 'This is a test message with a lot of text larger than 30 characters';
    return {
        longMessage,
        truncatedMessage: longMessage.slice(0, truncateContent).trim(),
        readMoreLabel: 'Read more',
        closeLabel: 'Delete test message'
    };
}

/**
 * Sets up the message story test canvas and component node.
 * @param {HTMLElement} canvasElement
 * @returns {Promise<{
 *   canvas: ReturnType<typeof within>,
 *   messageNode: MessageComponent | null
 * }>}
 */
export async function playSetup(canvasElement, tagName = 'arpa-message') {
    const canvas = within(canvasElement);
    await customElements.whenDefined(tagName);
    /** @type {MessageComponent | null} */
    const messageNode = canvasElement.querySelector(tagName);
    await messageNode?.promise;
    return { canvas, messageNode };
}

/**
 * Renders a message component with the given args and story context.
 * @param {MessageConfigType} args
 * @param {import('@storybook/web-components-vite').StoryContext} story
 * @param {string} [messageTag='arpa-message']
 * @returns {string}
 */
export function renderMessage(args, story, messageTag = 'arpa-message') {
    const text = args.text;
    delete args.text;
    return html`<${messageTag} ${attrString(args)}>${text}</${messageTag}>`;
}
