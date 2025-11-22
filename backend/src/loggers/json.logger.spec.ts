import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;
  let mockConsoleWarn: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  describe('formatMessage', () => {
    it('should format basic message correctly', () => {
      const result = logger.formatMessage('info', 'test message');
      const parsed = JSON.parse(result);

      expect(parsed).toEqual({
        level: 'info',
        message: 'test message',
        optionalParams: [],
      });
    });

    it('should include optional parameters', () => {
      const result = logger.formatMessage(
        'error',
        'user created',
        { id: 1 },
        'success',
      );
      const parsed = JSON.parse(result);

      expect(parsed).toEqual({
        level: 'error',
        message: 'user created',
        optionalParams: [{ id: 1 }, 'success'],
      });
    });

    it('should handle objects in message', () => {
      const messageObj = { user: 'john', action: 'login' };
      const result = logger.formatMessage('info', messageObj);
      const parsed = JSON.parse(result);

      expect(parsed).toEqual({
        level: 'info',
        message: messageObj,
        optionalParams: [],
      });
    });
  });
});
