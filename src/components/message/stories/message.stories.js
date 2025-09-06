/* eslint-disable sonarjs/no-duplicate-string */
import {
    AmazingComputingFacts,
    ApolloMission,
    HistoryOfComputing,
    SoftwareEngineer,
    VideoGameHistory
} from './templates.js';
import { attrString } from '@arpadroid/tools';
import { waitFor, expect, fireEvent, within } from '@storybook/test';
const html = String.raw;
const MessageStory = {
    title: 'Messages/Message',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    getArgs: () => {
        return {
            canClose: false,
            closeLabel: undefined,
            timeout: 0,
            text: HistoryOfComputing,
            truncateContent: 190
        };
    },
    getArgTypes: (category = 'Message Props') => {
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
    },
    render: (args, story, messageTag = 'arpa-message') => {
        const text = args.text;
        delete args.text;
        return html`<${messageTag} ${attrString(args)}>${text}</${messageTag}>`;
    }
};

export const Default = {
    name: 'Plain Message',
    parameters: {},
    argTypes: MessageStory.getArgTypes(),
    args: {
        ...MessageStory.getArgs(),
        icon: 'chat_bubble',
        closeLabel: 'Delete test message'
    }
};

export const InfoMessage = {
    argTypes: MessageStory.getArgTypes(),
    args: {
        ...MessageStory.getArgs(),
        text: AmazingComputingFacts
    },
    render: (args, story) => MessageStory.render(args, story, 'info-message')
};

export const SuccessMessage = {
    argTypes: MessageStory.getArgTypes(),
    args: {
        ...MessageStory.getArgs(),
        text: ApolloMission
    },
    render: (args, story) => MessageStory.render(args, story, 'success-message')
};

export const WarningMessage = {
    argTypes: MessageStory.getArgTypes(),
    args: {
        ...MessageStory.getArgs(),
        text: VideoGameHistory
    },
    render: (args, story) => MessageStory.render(args, story, 'warning-message')
};

export const ErrorMessage = {
    argTypes: MessageStory.getArgTypes(),
    args: {
        ...MessageStory.getArgs(),
        text: SoftwareEngineer
    },
    render: (args, story) => MessageStory.render(args, story, 'error-message')
};

export const Test = {
    args: Default.args,
    parameters: {},
    args: {
        ...Default.args,
        text: 'This is a test message',
        canClose: true,
        truncateContent: 30
    },
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    },
    playSetup: async canvasElement => {
        const canvas = within(canvasElement);
        await customElements.whenDefined('arpa-message');
        const messageNode = canvasElement.querySelector('arpa-message');
        await messageNode.load;
        return { canvas, messageNode };
    },
    play: async ({ canvasElement, step }) => {
        const setup = await Test.playSetup(canvasElement);
        const { canvas, messageNode } = setup;

        const ReadMoreButton = canvas.getByRole('button', { name: 'Read more' });

        await step('Renders the message', () => {
            expect(ReadMoreButton).toBeInTheDocument();
            expect(canvas.getByText('This is a test message')).toBeTruthy();
            expect(canvasElement.querySelector('.icon--chat_bubble')).toBeInTheDocument();
        });
        let deleteButton;
        await step('Renders the close button', async () => {
            await waitFor(() => {
                deleteButton = canvas.getByRole('button', { name: 'Delete test message' });
                expect(deleteButton).toBeTruthy();
            });
        });
        const longMessage = 'This is a test message with a lot of text larger than 30 characters';
        const truncatedMessage = longMessage.slice(0, 30).trim();
        console.log('truncatedMessage', truncatedMessage);
        await step(
            'Sets a message to something longer than the truncateContent value abd checks that it is truncated',
            async () => {
                messageNode.setContent(longMessage);
                await waitFor(() => {
                    const truncatedText = longMessage.slice(0, 30).trim();
                    expect(canvas.getByText('...')).toBeTruthy();
                    expect(canvas.getByText(truncatedText)).toBeTruthy();
                });
            }
        );

        await step('Clicks on read more button and checks that text is not truncated', async () => {
            ReadMoreButton.click();
            await waitFor(() => {
                expect(canvas.getByText(longMessage)).toBeTruthy();
            });
        });

        await step('Clicks on read less button and checks that text is truncated', async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            fireEvent.click(canvas.getByRole('button', { name: 'Read more' }));
            await waitFor(() => {
                expect(canvas.getByText(truncatedMessage)).toBeTruthy();
                expect(canvas.getByText('...')).toBeTruthy();
            });
        });

        await step('Clicks on close button and checks that message is removed', async () => {
            expect(canvas.getByText(truncatedMessage)).toBeTruthy();
            fireEvent.click(deleteButton);
            await new Promise(resolve => setTimeout(resolve, 500));
            await waitFor(() => {
                expect(canvas.queryByText(truncatedMessage)).toBeFalsy();
            });
        });
    }
};

export default MessageStory;
