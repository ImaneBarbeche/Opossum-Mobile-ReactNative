
import * as messageService from '../services/message.service';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('message.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get my message listings', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: [{ listingId: 'list2', listingTitle: 'Titre', conversationCount: 1 }] }),
    });
    const res = await messageService.getMyMessageListings('token');
    expect(res[0].listingId).toBe('list2');
  });

  it('should contact listing owner', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ conversationId: 'conv1', firstMessage: { messageId: 'msg1', content: 'Hello' } }),
    });
    const res = await messageService.contactListingOwner('token', 'listing1', 'Hello', 'receiver1');
    expect(res.conversationId).toBe('conv1');
    expect(res.firstMessage.messageId).toBe('msg1');
    expect(res.firstMessage.content).toBe('Hello');
  });

  it('should send message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: { messageId: 'msg2', content: 'Hi' }, conversationId: 'conv2' }),
    });
    const res = await messageService.sendMessage('token', 'conv2', 'Hi', 'receiver2');
    expect(res.message.messageId).toBe('msg2');
    expect(res.message.content).toBe('Hi');
    expect(res.conversationId).toBe('conv2');
  });

  it('should get listing conversations', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: [{ conversationId: 'conv3', listingId: 'list3' }] }),
    });
    const res = await messageService.getListingConversations('token', 'list3');
    expect(res[0].conversationId).toBe('conv3');
  });

  it('should get conversation messages', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ conversationInfo: { conversationId: 'conv3' }, messages: [{ messageId: 'msg3', content: 'Test' }], totalElements: 1, totalPages: 1 }),
    });
    const res = await messageService.getConversationMessages('token', 'conv3');
    expect(res.messages[0].messageId).toBe('msg3');
    expect(res.messages[0].content).toBe('Test');
  });

  it('should mark conversation as read', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'OK' }),
    });
    await expect(messageService.markConversationAsRead('token', 'conv4')).resolves.toEqual({ status: 'OK' });
  });

  it('should delete message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'DELETED', message: 'Deleted' }),
    });
    await expect(messageService.deleteMessage('token', 'msg4')).resolves.toEqual({ status: 'DELETED', message: 'Deleted' });
  });

  it('should report message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Signalé',
    });
    await expect(messageService.reportMessage('token', 'msg6', 'spam')).resolves.toBe('Signalé');
  });
});