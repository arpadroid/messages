/**
 * @typedef {import('./messages').default} Messages
 * @typedef {import('../message/message.js').default} Message
 * @typedef {import('./messages.types').MessagesConfigType} MessagesConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<MessagesConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<MessagesConfigType>} Story
 * @typedef {import('@arpadroid/resources').ListResourceItemType} ListResourceItemType
 */

import { expect, waitFor, within, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';

const html = String.raw;

/** @type {Meta} */
const MessagesStory = {
    component: 'arpa-messages',
    title: 'Messages/Messages',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    render: args => html`
        <arpa-messages id="messages" ${$attr(args)}>
            <arpa-message can-close truncate-content="30">This is a test message</arpa-message>
            <info-message can-close truncate-content="30">This is an info message</info-message>
            <success-message can-close truncate-content="30">This is a success message</success-message>
            <warning-message can-close truncate-content="30">This is a warning message</warning-message>
            <error-message can-close truncate-content="30">This is an error message</error-message>
        </arpa-messages>
    `
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: {
        ...defaultParams
    }
};

/** @type {Story} */
export const Test = {
    args: {
        ...Default.args,
        title: 'Messages Test',
        prependNewMessages: true
    },
    parameters: testParams,
    play: async ({ canvasElement, step, canvas }) => {
        const messages = /** @type {Messages | null} */ (canvasElement.querySelector('arpa-messages'));
        await messages?.promise;
        await step('Renders the messages', async () => {
            await waitFor(() => {
                expect(canvas.getByText('This is a test message')).toBeTruthy();
                expect(canvas.getByText('This is an info message')).toBeTruthy();
                expect(canvas.getByText('This is a success message')).toBeTruthy();
                expect(canvas.getByText('This is a warning message')).toBeTruthy();
                expect(canvas.getByText('This is an error message')).toBeTruthy();
            });
        });
        const newMessageText = 'This is a new message';
        /** @type {ListResourceItemType | null} */
        let newMessage;
        await step('Adds a new message', async () => {
            newMessage = messages?.addMessage({ content: newMessageText }) || null;
            await waitFor(() => {
                const newMessage = canvas.getByText(newMessageText);
                expect(newMessage).toBeTruthy();
                const messageWrapper = newMessage.closest('info-message');
                expect(messages?.children?.[0]).toBe(messageWrapper);
            });
        });

        await step('Deletes the new message', async () => {
            newMessage && messages?.deleteMessage(newMessage);
            await waitFor(() => {
                expect(canvas.queryByText(newMessageText)).toBeNull();
            });
        });

        await step('Deletes last message by clicking the close button', async () => {
            const lastMessage = /** @type {HTMLButtonElement} */ (
                messages?.children[messages.children.length - 1]
            );
            const closeButton = await waitFor(
                () => lastMessage && within(lastMessage).getByRole('button', { name: 'Close' })
            );
            await waitFor(() => {
                expect(closeButton).toBeTruthy();
            });

            await userEvent.click(closeButton);

            await waitFor(() => {
                expect(canvas.queryByText('This is an error message')).toBeNull();
            });
        });

        await step('Deletes all messages', async () => {
            messages?.deleteMessages();
            await waitFor(() => {
                expect(messages?.children?.length).toBe(0);
            });
        });

        await step('adds multiple messages', async () => {
            messages?.addMessages([{ content: 'This is another new message' }, { content: newMessageText }]);
            await waitFor(() => {
                expect(canvas.getByText('This is a new message')).toBeTruthy();
                expect(canvas.getByText('This is another new message')).toBeTruthy();
            });
        });
    }
};

export default MessagesStory;
