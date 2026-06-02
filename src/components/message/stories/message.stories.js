/**
 * @typedef {import('../message.types.js').MessageConfigType} MessageConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<MessageConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<MessageConfigType>} Story
 */

import { expect, userEvent, waitFor } from 'storybook/test';
import { AmazingComputingFacts, ApolloMission, SoftwareEngineer, VideoGameHistory } from './templates.js';
import { getArgs, playSetup, renderMessage } from './message.stories.util.js';

/** @type {Meta} */
const MessageStory = {
    title: 'Messages/Message',
    component: 'arpa-message',
    tags: [],
    args: getArgs(),
    parameters: {
        layout: 'padded'
    },
    render: (args, story) => renderMessage(args, story, 'info-message')
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
    args: {
        text: AmazingComputingFacts
    },

    render: (args, story) => renderMessage(args, story, 'info-message')
};

/** @type {Story} */
export const SuccessMessage = {
    args: {
        text: ApolloMission
    },
    render: (args, story) => renderMessage(args, story, 'success-message')
};

/** @type {Story} */
export const WarningMessage = {
    args: {
        text: VideoGameHistory
    },
    render: (args, story) => renderMessage(args, story, 'warning-message')
};

/** @type {Story} */
export const ErrorMessage = {
    args: {
        text: SoftwareEngineer
    },
    render: (args, story) => renderMessage(args, story, 'error-message')
};

/** @type {Story} */
export const Test = {
    args: {
        ...Default.args,
        text: 'This is a test message',
        canClose: true,
        truncateContent: 27,
        truncateButton: true
    },
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    },
    render: (args, story) => renderMessage(args, story, 'info-message'),

    play: async ({ canvasElement, step }) => {
        const setup = await playSetup(canvasElement, 'info-message');
        const { canvas, messageNode } = setup;
        const ReadMoreButton = canvas.queryAllByRole('button', { name: /Read more/i })[0];

        await step('Renders the message', async () => {
            await waitFor(() => expect(messageNode).not.toBeNull());

            expect(ReadMoreButton).toBeInTheDocument();
            expect(canvas.getByText('This is a test message')).toBeTruthy();
            expect(canvasElement.querySelector('.icon--chat_bubble')).toBeInTheDocument();
        });
        /** @type {HTMLButtonElement} */
        const deleteButton = await waitFor(() => canvas.getByRole('button', { name: 'Delete test message' }));
        const longMessage = 'This is a test message with a lot of text larger than 30 characters';
        const truncatedMessage = longMessage.slice(0, 28).trim();

        await step('Renders the close button', async () => {
            expect(deleteButton).toBeInTheDocument();
        });

        await step(
            'Sets a message to something longer than the truncateContent value abd checks that it is truncated',
            async () => {
                messageNode?.setContent(longMessage);
                await waitFor(() => {
                    expect(canvas.getByText('...')).toBeInTheDocument();
                    expect(canvas.getByText(truncatedMessage)).toBeInTheDocument();
                });
            }
        );

        await step('Clicks on read more button and checks that text is not truncated', async () => {
            await userEvent.click(ReadMoreButton);
            await waitFor(() => {
                expect(canvas.getByText(longMessage)).toBeTruthy();
                expect(canvas.queryByText('...')).not.toBeInTheDocument();
                expect(canvas.getByRole('button', { name: 'read less' })).toBeInTheDocument();
            });
        });

        await step('Clicks on read less button and checks that text is truncated', async () => {
            await userEvent.click(canvas.getByRole('button', { name: 'read less' }));
            await waitFor(() => {
                expect(canvas.getByText(truncatedMessage)).toBeTruthy();
                expect(canvas.getByText('...')).toBeTruthy();
            });
        });

        await step('Clicks on close button and checks that message is removed', async () => {
            expect(canvas.getByText(truncatedMessage)).toBeTruthy();
            await userEvent.click(deleteButton);
            await waitFor(() => {
                expect(canvas.queryByText(truncatedMessage)).not.toBeInTheDocument();
            });
        });
    }
};

export default MessageStory;
