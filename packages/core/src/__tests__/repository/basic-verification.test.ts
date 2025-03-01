/**
 * Basic verification test to make sure our test environment is working
 */
describe('Basic Verification', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should handle simple imports', () => {
    const { PlatformErrorCode } = require('../../types/platform');
    expect(PlatformErrorCode).toBeDefined();
    expect(PlatformErrorCode.REPOSITORY_NOT_FOUND).toBe('REPOSITORY_NOT_FOUND');
  });
});
