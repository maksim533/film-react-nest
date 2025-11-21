import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(
    level: string,
    message: any,
    ...optionalParams: any[]
  ): string {
    const parts = [
      `timestamp=${new Date().toISOString()}`,
      `level=${level}`,
      `message=${this.escapeValue(String(message))}`,
    ];

    if (optionalParams.length > 0) {
      parts.push(`params=${this.escapeValue(JSON.stringify(optionalParams))}`);
    }

    return parts.join('\t');
  }

  private escapeValue(value: string): string {
    return value
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }
  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }
  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }
}
