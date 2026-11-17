/**
 * @typedef {import('../message.js').default} Message
 * @typedef {import('../message.types.js').MessageConfigType} MessageConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<MessageConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<MessageConfigType>} Story
 */

import { expect, userEvent, waitFor } from 'storybook/test';
import {
    AmazingComputingFacts,
    ApolloMission,
    LongMessage,
    SoftwareEngineer,
    VideoGameHistory
} from './templates.js';
import { testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';

const html = String.raw;

/** @type {Meta} */
const MessageTruncatedStory = {
    component: 'arpa-message',
    title: 'Messages/Message/Truncated',
    tags: [],
    beforeEach: async ({ canvasElement }) => {
        canvasElement.querySelector('arpa-messages')?.remove();
    },
    parameters: {
        layout: 'padded'
    },
    args: { truncateContent: 100 }
};

/** @type {Story} */
export const Info = {
    name: 'Info',
    render: args =>
        html`<arpa-messages id="info">
            <info-message ${$attr(args)}>${AmazingComputingFacts}</info-message>
        </arpa-messages>`
};

/** @type {Story} */
export const Success = {
    name: 'Success',
    render: args =>
        html`<arpa-messages id="success">
            <success-message ${$attr(args)}>${ApolloMission}</success-message>
        </arpa-messages>`
};

/** @type {Story} */
export const Warning = {
    name: 'Warning',
    render: args =>
        html`<arpa-messages id="warning">
            <warning-message ${$attr(args)}>${VideoGameHistory}</warning-message>
        </arpa-messages>`
};

/** @type {Story} */
export const ErrorMsg = {
    name: 'Error',
    render: args =>
        html`<arpa-messages id="error-messages">
            <error-message ${$attr(args)}>${SoftwareEngineer}</error-message>
        </arpa-messages>`
};

/** @type {Story} */
export const TestTruncated = {
    name: 'Test - truncated 🧪',
    args: {
        id: 'test-message-with-button',
        canClose: true,
        truncateLines: undefined,
        truncateContent: 80,
        closeLabel: 'Delete test message'
    },
    render: args => html`<arpa-message ${$attr(args)}>${LongMessage}</arpa-message>`,
    parameters: testParams,
    play: async ({ canvas, canvasElement, step, args }) => {
        const messageNode = /** @type {Message} */ (canvasElement.querySelector('arpa-message'));
        const truncatedMessage = LongMessage.slice(0, args.truncateContent);

        await step('Renders the message', async () => {
            await waitFor(() => {
                expect(canvas.getByText(truncatedMessage, { exact: false })).toBeInTheDocument();
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
                await messageNode?.setContent(LongMessage);
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
                expect(canvas.getByText(LongMessage, { exact: false })).toBeInTheDocument();
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
                expect(canvas.queryByText(LongMessage)).not.toBeInTheDocument();
            });
        });
    }
};

export default MessageTruncatedStory;
