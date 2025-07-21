import { isValidEmail, isStrongPassword, isValidName, isValidPhone, isValidAvatarUrl } from '../utils/validators';

describe('validators', () => {
  it('should validate email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('bademail')).toBe(false);
  });

  it('should validate strong password', () => {
    expect(isStrongPassword('Abcdefg1')).toBe(true);
    expect(isStrongPassword('abcdefg1')).toBe(false);
    expect(isStrongPassword('ABCDEFG1')).toBe(false);
    expect(isStrongPassword('Abcdefgh')).toBe(false);
  });

  it('should validate name', () => {
    expect(isValidName('John')).toBe(true);
    expect(isValidName('')).toBe(false);
    expect(isValidName('a'.repeat(51))).toBe(false);
  });

  it('should validate phone', () => {
    expect(isValidPhone('0601020304')).toBe(true);
    expect(isValidPhone('061234567')).toBe(false);
    expect(isValidPhone('')).toBe(true);
    expect(isValidPhone()).toBe(true);
  });

  it('should validate avatar url', () => {
    expect(isValidAvatarUrl('https://example.com/avatar.png')).toBe(true);
    expect(isValidAvatarUrl('file://local/path')).toBe(true);
    expect(isValidAvatarUrl('not-a-url')).toBe(false);
    expect(isValidAvatarUrl()).toBe(true);
  });
});
