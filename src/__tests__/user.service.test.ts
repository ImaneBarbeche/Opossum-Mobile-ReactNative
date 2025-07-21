import * as userService from '../services/user.service';

// Mock axios and fetch for isolation
jest.mock('axios');
const axios = require('axios');
global.fetch = jest.fn();

describe('user.service', () => {
  const fetchMock = fetch as unknown as jest.Mock;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should verify user email', async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true } });
    const res = await userService.verifyUserEmail('token');
    expect(res.success).toBe(true);
  });

  it('should delete user account', async () => {
    axios.request.mockResolvedValueOnce({ data: { deleted: true } });
    const res = await userService.deleteUserAccount('pass', 'token');
    expect(res.deleted).toBe(true);
  });

  it('should change user password', async () => {
    axios.put.mockResolvedValueOnce({ data: { changed: true } });
    const res = await userService.changeUserPassword('old', 'new', 'token');
    expect(res.changed).toBe(true);
  });

  it('should fetch current user profile', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ id: '1', email: 'a@a.com' })
    });
    const res = await userService.fetchCurrentUserProfile('token');
    expect(res.email).toBe('a@a.com');
  });

  it('should update user profile', async () => {
    axios.put.mockResolvedValueOnce({ data: { updated: true } });
    const res = await userService.updateUserProfile({ email: 'a@a.com' }, 'token');
    expect(res.updated).toBe(true);
  });
});
