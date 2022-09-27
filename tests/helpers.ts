export function getMocks(messageContent: string) {
  const mockedMessage = {
    channel: {
      send: jest.fn(),
    },
    reply: jest.fn(),
    content: messageContent,
  };
  const mockedInteraction = {
    channel: {
      send: jest.fn(),
    },
    reply: jest.fn(),
    content: "",
  };
}
