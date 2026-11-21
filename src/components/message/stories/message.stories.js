/**
 * @typedef {import('../message.js').default} Message
 * @typedef {import('../message.types.js').MessageConfigType} MessageConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<MessageConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<MessageConfigType>} Story
 */

import { expect, userEvent, waitFor } from 'storybook/test';
import { LongMessage } from './templates.js';
import { testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';

const html = String.raw;

/** @type {Meta} */
const MessageStory = {
    component: 'arpa-message',
    title: 'Messages/Message',
    tags: [],
    beforeEach: async ({ canvasElement }) => {
        canvasElement.querySelector('arpa-messages')?.remove();
    },
    parameters: {
        layout: 'padded'
    },
    render: args => html`<arpa-message ${$attr(args)}>Test message</arpa-message>`
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: {},
    args: {
        icon: 'chat_bubble',
        closeLabel: 'Delete test message'
    }
};

/** @type {Story} */
export const TestTextHandler = {
    name: 'Test - text handler 🧪',
    args: {
        canClose: true,
        truncateContent: 127,
        icon: 'chat_bubble',
        closeLabel: 'Delete test message',
        hasTextToggle: true
    },
    render: args => html`<arpa-message ${$attr(args)}>${LongMessage}</arpa-message>`,
    parameters: testParams,
    play: async ({ canvasElement, step, canvas, args }) => {
        const messageNode = /** @type {Message} */ (canvasElement.querySelector('arpa-message'));
        await messageNode.promise;
        const truncatedMessage = LongMessage.slice(0, args.truncateContent);

        await step('Renders the message', async () => {
            await waitFor(() => {
                expect(canvas.getByText(LongMessage)).toBeInTheDocument();
                expect(canvasElement.querySelector('.icon--chat_bubble')).toBeInTheDocument();
            });
        });

        await step('clicking on the text itself actions the truncation toggle', async () => {
            await waitFor(() => canvas.getByText(truncatedMessage));
            const textNode = canvas.getByText(truncatedMessage);
            await userEvent.click(textNode, { delay: 10 });
            await waitFor(() => {
                expect(canvas.getByText(LongMessage)).toBeInTheDocument();
                expect(canvas.queryByText('...')).not.toBeInTheDocument();
            });
        });

        await step('Clicks on read less', async () => {
            await userEvent.click(canvas.getByText(/read less/i));
            await waitFor(() => canvas.getByText(truncatedMessage));
        });
    }
};

export default MessageStory;
