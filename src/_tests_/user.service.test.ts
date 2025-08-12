import * as userService from '../services/user.service';
import axios from 'axios';

jest.mock('axios');

describe('user.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get public profile', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { id: 'user1', email: 'test@example.com' } });
    const res = await userService.getPublicProfile('user1') as any;
    expect(res.id).toBe('user1');
    expect(res.email).toBe('test@example.com');
  });

  it('should verify user email', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
    const res = await userService.verifyUserEmail('token') as any;
    expect(res.success).toBe(true);
  });

  it('should delete user account', async () => {
    (axios.request as jest.Mock).mockResolvedValueOnce({ data: { deleted: true } });
    const res = await userService.deleteUserAccount('password', 'token') as any;
    expect(res.deleted).toBe(true);
  });

  it('should update user profile', async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: { id: 'user1', firstName: 'John', lastName: 'Doe' } });
    const res = await userService.updateUserProfile({ firstName: 'John', lastName: 'Doe' }, 'token') as any;
    expect(res.id).toBe('user1');
    expect(res.firstName).toBe('John');
  });

  it('should get user profile (me)', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { id: 'me', email: 'me@example.com', firstName: 'Me', lastName: 'User' } })
    });
    const res = await userService.getUserProfile('me', 'token') as any;
    expect(res.id).toBe('me');
    expect(res.email).toBe('me@example.com');
    expect(res.firstName).toBe('Me');
  });

  it('should get user profile (public)', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { id: 'user2', email: 'public@example.com', firstName: 'Public', lastName: 'User' } })
    });
    const res = await userService.getUserProfile('user2', 'token') as any;
    expect(res.id).toBe('user2');
    expect(res.email).toBe('public@example.com');
    expect(res.firstName).toBe('Public');
  });

  it('should change user password', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });
    const res = await userService.changeUserPassword('old', 'new', 'token') as any;
    expect(res.success).toBe(true);
  });

  it('should fetch current user profile', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 'me', email: 'me@example.com', firstName: 'Me', lastName: 'User' } })
    });
    const res = await userService.fetchCurrentUserProfile('token') as any;
    expect(res?.id).toBe('me');
    expect(res?.email).toBe('me@example.com');
    expect(res?.firstName).toBe('Me');
  });
});