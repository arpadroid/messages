/**
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
const MessageClampedStory = {
    component: 'arpa-message',
    title: 'Messages/Message/Clamped',
    tags: [],
    beforeEach: async ({ canvasElement }) => {
        canvasElement.querySelector('arpa-messages')?.remove();
    },
    parameters: {
        layout: 'padded'
    }
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
export const Short = {
    name: 'Short',
    render: args =>
        html`<arpa-messages id="error-messages">
            <arpa-message ${$attr(args)}>Some short text but not too short.</arpa-message>
        </arpa-messages>`
};

/** @type {Story} */
export const TestClamped = {
    name: 'Test - clamped 🧪',
    args: {
        id: 'test-message-with-button',
        canClose: true,
        truncateLines: 3,
        closeLabel: 'Delete test message'
    },
    render: args => html`<arpa-message ${$attr(args)}>${LongMessage}</arpa-message>`,
    parameters: testParams,
    play: async ({ canvas, canvasElement, step, args }) => {
        const truncatedMessage = LongMessage.slice(0, args.truncateContent);
        await waitFor(() => {
            expect(canvas.getByRole('button')).toBeInTheDocument();
        });

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

        await step('Clicks on read more button and checks that text is not truncated', async () => {
            const readMoreButton = /** @type {HTMLButtonElement} */ (
                canvas.getByText(/read more/i).closest('button')
            );
            await userEvent.click(readMoreButton);
            await waitFor(() => {
                expect(canvas.getByText(LongMessage, { exact: false })).toBeInTheDocument();
                expect(canvas.getByRole('button', { name: /read more/i })).toBeInTheDocument();
            });
        });

        await step('Clicks on read less button and checks that text is truncated', async () => {
            const readLessButton = /** @type {HTMLButtonElement} */ (
                canvas.getByText(/read less/i).closest('button')
            );

            await userEvent.click(readLessButton);
            await waitFor(() => {
                expect(canvas.getByText(truncatedMessage)).toBeTruthy();
            });
        });

        await step('Clicks on close button and checks that message is removed', async () => {
            const deleteButton = await waitFor(() =>
                canvas.getByRole('button', { name: 'Delete test message' })
            );
            await userEvent.click(deleteButton, { delay: 10 });
            await waitFor(() => {
                expect(canvas.queryByText(LongMessage)).not.toBeInTheDocument();
            });
        });
    }
};

export default MessageClampedStory;
