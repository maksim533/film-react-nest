import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;
  let mockConsoleWarn: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
    jest.useRealTimers();
  });

  describe('formatMessage', () => {
    it('should format basic TSKV message correctly', () => {
      const result = (logger as any).formatMessage('info', 'test message');

      expect(result).toBe(
        'timestamp=2023-01-01T00:00:00.000Z\tlevel=info\tmessage=test message',
      );
    });

    it('should include optional parameters as JSON string', () => {
      const result = (logger as any).formatMessage(
        'error',
        'user created',
        { id: 1 },
        'success',
      );

      expect(result).toContain('timestamp=');
      expect(result).toContain('level=error');
      expect(result).toContain('message=user created');
      expect(result).toContain('params=[{"id":1},"success"]');
    });

    it('should escape special characters in message', () => {
      const result = (logger as any).formatMessage(
        'warn',
        'line1\nline2\t tab\r return',
      );

      expect(result).toContain('message=line1\\nline2\\t tab\\r return');
    });

    it('should handle objects in message by converting to string', () => {
      const obj = { user: 'john', age: 30 };
      const result = (logger as any).formatMessage('info', obj);

      expect(result).toContain('message=[object Object]');
    });

    it('should not include params when optionalParams is empty', () => {
      const result = (logger as any).formatMessage('debug', 'test');

      expect(result).not.toContain('params=');
      expect(result).toBe(
        'timestamp=2023-01-01T00:00:00.000Z\tlevel=debug\tmessage=test',
      );
    });
  });

  describe('escapeValue', () => {
    it('should escape tabs', () => {
      const result = (logger as any).escapeValue('hello\tworld');
      expect(result).toBe('hello\\tworld');
    });

    it('should escape newlines', () => {
      const result = (logger as any).escapeValue('hello\nworld');
      expect(result).toBe('hello\\nworld');
    });

    it('should escape carriage returns', () => {
      const result = (logger as any).escapeValue('hello\rworld');
      expect(result).toBe('hello\\rworld');
    });

    it('should escape multiple special characters', () => {
      const result = (logger as any).escapeValue('line1\nline2\tline3\r');
      expect(result).toBe('line1\\nline2\\tline3\\r');
    });

    it('should not modify string without special characters', () => {
      const result = (logger as any).escapeValue('normal string');
      expect(result).toBe('normal string');
    });
  });

  describe('log methods', () => {
    it('should call console.log with TSKV format for log method', () => {
      logger.log('test message', 'param1');

      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
      const output = mockConsoleLog.mock.calls[0][0];

      expect(output).toContain('timestamp=');
      expect(output).toContain('level=log');
      expect(output).toContain('message=test message');
      expect(output).toContain('params=');
    });

    it('should call console.error for error method', () => {
      logger.error('error message', { error: 'details' });

      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      const output = mockConsoleError.mock.calls[0][0];

      expect(output).toContain('level=error');
      expect(output).toContain('message=error message');
    });

    it('should call console.warn for warn method', () => {
      logger.warn('warning message');

      expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
      const output = mockConsoleWarn.mock.calls[0][0];

      expect(output).toContain('level=warn');
      expect(output).toContain('message=warning message');
      expect(output).not.toContain('params=');
    });

    it('should maintain TSKV format with tabs as separators', () => {
      logger.log('test');

      const output = mockConsoleLog.mock.calls[0][0];
      const parts = output.split('\t');

      expect(parts.length).toBe(3);
      expect(parts[0].startsWith('timestamp=')).toBe(true);
      expect(parts[1].startsWith('level=')).toBe(true);
      expect(parts[2].startsWith('message=')).toBe(true);
    });
  });
});
