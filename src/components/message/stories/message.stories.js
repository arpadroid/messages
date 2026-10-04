/**
 * @typedef {import('../message.js').default} Message
 * @typedef {import('../message.types.js').MessageConfigType} MessageConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<MessageConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<MessageConfigType>} Story
 */

import { expect, userEvent, waitFor } from 'storybook/test';
import { AmazingComputingFacts, ApolloMission, SoftwareEngineer, VideoGameHistory } from './templates.js';
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
    name: 'Plain Message',
    parameters: {},
    args: {
        icon: 'chat_bubble',
        closeLabel: 'Delete test message'
    }
};

/** @type {Story} */
export const InfoMessage = {
    render: args => html`<info-message ${$attr(args)}>${AmazingComputingFacts}</info-message>`
};

/** @type {Story} */
export const SuccessMessage = {
    render: args => html`<success-message ${$attr(args)}>${ApolloMission}</success-message>`
};

/** @type {Story} */
export const WarningMessage = {
    render: args => html`<warning-message ${$attr(args)}>${VideoGameHistory}</warning-message>`
};

/** @type {Story} */
export const ErrorMessage = {
    render: args => html`<error-message ${$attr(args)}>${SoftwareEngineer}</error-message>`
};

const longMessage = 'This is a test message with a lot of text larger than 30 characters';
const truncatedMessage = longMessage.slice(0, 28).trim();

/** @type {Story} */
export const WithButton = {
    args: {
        id: 'test-message-with-button',
        canClose: true,
        truncateContent: 27,
        truncateButton: true,
        closeLabel: 'Delete test message',
        hasTextToggle: false
    },
    render: args => html`<arpa-message ${$attr(args)}>This is a test message</arpa-message>`,
    parameters: testParams,
    play: async ({ canvas, canvasElement, step }) => {
        const messageNode = /** @type {Message} */ (canvasElement.querySelector('arpa-message'));

        await step('Renders the message', async () => {
            await waitFor(() => {
                expect(canvas.getByText('This is a test message')).toBeTruthy();
                expect(canvasElement.querySelector('.icon--chat_bubble')).toBeInTheDocument();
            });
        });

        /** @type {HTMLButtonElement} */
        const deleteButton = await waitFor(() => canvas.getByRole('button', { name: 'Delete test message' }));
        await step('Renders the close button', async () => {
            expect(deleteButton).toBeInTheDocument();
        });

        await step(
            'Sets a message to something longer than the truncateContent value and checks that it is truncated',
            async () => {
                await messageNode?.setContent(longMessage);
                await waitFor(() => {
                    expect(canvas.getByText('...')).toBeInTheDocument();
                    expect(canvas.getByText(truncatedMessage)).toBeInTheDocument();
                    expect(canvas.getByRole('button', { name: /read more/i })).toBeInTheDocument();
                });
            }
        );

        await step('Clicks on read more button and checks that text is not truncated', async () => {
            const readMoreButton = canvas.getByRole('button', { name: /read more/i });
            await userEvent.click(readMoreButton);
            await waitFor(() => {
                expect(canvas.getByText(longMessage)).toBeTruthy();
                expect(canvas.queryByText('...')).not.toBeInTheDocument();
                expect(canvas.getByRole('button', { name: /read less/i })).toBeInTheDocument();
            });
        });

        await step('Clicks on read less button and checks that text is truncated', async () => {
            await userEvent.click(canvas.getByRole('button', { name: /read less/i }));
            await waitFor(() => {
                expect(canvas.getByText(truncatedMessage)).toBeTruthy();
                expect(canvas.getByText('...')).toBeTruthy();
            });
        });

        await step('Clicks on close button and checks that message is removed', async () => {
            const deleteButton = await waitFor(() =>
                canvas.getByRole('button', { name: 'Delete test message' })
            );

            expect(canvas.getByText(truncatedMessage)).toBeTruthy();
            await userEvent.click(deleteButton);
            await waitFor(() => {
                expect(canvas.queryByText(longMessage)).not.toBeInTheDocument();
            });
        });
    }
};

/** @type {Story} */
export const WithTextHandler = {
    args: {
        canClose: true,
        truncateContent: 27,
        icon: 'chat_bubble',
        truncateButton: 'false',
        closeLabel: 'Delete test message',
        hasTextToggle: true
    },
    render: args => html`<arpa-message ${$attr(args)}>${longMessage}</arpa-message>`,
    parameters: testParams,
    play: async ({ canvasElement, step, canvas }) => {
        const messageNode = /** @type {Message} */ (canvasElement.querySelector('arpa-message'));
        await messageNode.promise;

        await step('Renders the message', async () => {
            await waitFor(() => {
                expect(canvas.getByText(longMessage)).toBeInTheDocument();
                expect(canvasElement.querySelector('.icon--chat_bubble')).toBeInTheDocument();
            });
        });

        await step('clicking on the text itself actions the truncation toggle', async () => {
            await waitFor(() => canvas.getByText(truncatedMessage));
            const textNode = canvas.getByText(truncatedMessage);
            await userEvent.click(textNode);
            await waitFor(() => {
                expect(canvas.getByText(longMessage)).toBeTruthy();
                expect(canvas.queryByText('...')).not.toBeInTheDocument();
            });
        });
    }
};

export default MessageStory;
