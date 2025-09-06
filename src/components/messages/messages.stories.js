/**
 * @typedef {import('./messages').default} MessagesComponent
 */
import { attrString } from '@arpadroid/tools';
import { waitFor, expect, within } from '@storybook/test';
const html = String.raw;
const MessagesStory = {
    title: 'Messages/Messages',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    getArgs: () => {
        return {
            prependNewMessages: false
        };
    },
    getArgTypes: (category = 'Messages Props') => {
        return {
            prependNewMessages: { control: { type: 'boolean' }, table: { category } }
        };
    },
    render: args => {
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
};

export const Default = {
    name: 'Render',
    parameters: {},
    argTypes: MessagesStory.getArgTypes(),
    args: { ...MessagesStory.getArgs() }
};

export const Test = {
    args: Default.args,
    parameters: {},
    args: {
        ...Default.args,
        canClose: true,
        truncateContent: 30,
        title: 'Messages Test',
        prependNewMessages: true
    },
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    },
    playSetup: async canvasElement => {
        const canvas = within(canvasElement);
        await customElements.whenDefined('arpa-messages');
        /** @type {MessagesComponent} */
        const messages = canvasElement.querySelector('arpa-messages');
        await messages?.promise;
        return { canvas, messages };
    },
    play: async ({ canvasElement, step }) => {
        const setup = await Test.playSetup(canvasElement);
        const { canvas, messages } = setup;

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
        let newMessage;
        await step('Adds a new message', async () => {
            newMessage = messages.addMessage({ content: newMessageText });
            await waitFor(() => {
                const newMessage = canvas.getByText(newMessageText);
                expect(newMessage).toBeTruthy();
                const messageWrapper = newMessage.closest('info-message');
                expect(messages.children[0]).toBe(messageWrapper);
            });
        });

        await step('Deletes the new message', async () => {
            messages.deleteMessage(newMessage);
            await waitFor(() => {
                expect(canvas.queryByText(newMessageText)).toBeNull();
            });
        });

        await step('Deletes last message by clicking the close button', async () => {
            const lastMessage = messages.children[messages.children.length - 1];
            const closeButton = await waitFor(() =>
                within(lastMessage).getByRole('button', { name: 'Close' })
            );
            await waitFor(() => {
                expect(closeButton).toBeTruthy();
            });

            closeButton.click();

            await waitFor(() => {
                expect(canvas.queryByText('This is an error message')).toBeNull();
            });
        });

        await step('Deletes all messages', async () => {
            messages.deleteMessages();
            await waitFor(() => {
                expect(messages.children.length).toBe(0);
            });
        });

        await step('adds multiple messages', async () => {
            messages.addMessages([{ text: 'This is another new message' }, { text: newMessageText }]);
            await waitFor(() => {
                expect(canvas.getByText('This is a new message')).toBeTruthy();
                expect(canvas.getByText('This is another new message')).toBeTruthy();
            });
        });
    }
};

export default MessagesStory;
