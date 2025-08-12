import * as messageService from '../services/message.service';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('message.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get user conversations', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ conversationId: 'conv1', listingId: 'list1' }]),
    });
    const res = await messageService.getUserConversations('token', 'user1');
    expect(res[0].conversationId).toBe('conv1');
  });

  it('should contact listing owner', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messageId: 'msg1', content: 'Hello' }),
    });
    const res = await messageService.contactListingOwner('token', 'listing1', 'Hello');
    expect(res.messageId).toBe('msg1');
    expect(res.content).toBe('Hello');
  });

  it('should send message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messageId: 'msg2', content: 'Hi' }),
    });
    const res = await messageService.sendMessage('token', 'conv1', 'Hi');
    expect(res.messageId).toBe('msg2');
    expect(res.content).toBe('Hi');
  });

  it('should get my message listings', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ conversationId: 'conv2', listingId: 'list2' }]),
    });
    const res = await messageService.getMyMessageListings('token', 'user1');
    expect(res[0].conversationId).toBe('conv2');
  });

  it('should get listing conversations', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ conversationId: 'conv3', listingId: 'list3' }]),
    });
    const res = await messageService.getListingConversations('token', 'list3');
    expect(res[0].conversationId).toBe('conv3');
  });

  it('should get conversation messages', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ messageId: 'msg3', content: 'Test' }]),
    });
    const res = await messageService.getConversationMessages('token', 'conv3');
    expect(res[0].messageId).toBe('msg3');
    expect(res[0].content).toBe('Test');
  });

  it('should mark all messages as read', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await expect(messageService.markAllMessagesAsRead('token', 'conv4')).resolves.toBeUndefined();
  });

  it('should mark conversation as read', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await expect(messageService.markConversationAsRead('token', 'list4', 'otherUser')).resolves.toBeUndefined();
  });

  it('should delete message', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await expect(messageService.deleteMessage('token', 'msg4')).resolves.toBeUndefined();
  });

  it('should archive message', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await expect(messageService.archiveMessage('token', 'msg5')).resolves.toBeUndefined();
  });

  it('should report message', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await expect(messageService.reportMessage('token', 'msg6', 'spam')).resolves.toBeUndefined();
  });
});