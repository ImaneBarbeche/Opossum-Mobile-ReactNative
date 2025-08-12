import * as userService from '../services/user.service';
import axios from 'axios';

jest.mock('axios');

describe('user.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get public profile', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { id: 'user1', email: 'test@example.com' } });
    const res = await userService.getPublicProfile('user1');
    expect(res.id).toBe('user1');
    expect(res.email).toBe('test@example.com');
  });

  it('should verify user email', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
    const res = await userService.verifyUserEmail('token');
    expect(res.success).toBe(true);
  });

  it('should delete user account', async () => {
    (axios.request as jest.Mock).mockResolvedValueOnce({ data: { deleted: true } });
    const res = await userService.deleteUserAccount('password', 'token');
    expect(res.deleted).toBe(true);
  });

  it('should update user profile', async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: { id: 'user1', firstName: 'John', lastName: 'Doe' } });
    const res = await userService.updateUserProfile({ firstName: 'John', lastName: 'Doe' }, 'token');
    expect(res.id).toBe('user1');
    expect(res.firstName).toBe('John');
  });
});