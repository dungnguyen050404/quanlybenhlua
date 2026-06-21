import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  private readonly logDir = path.join(process.cwd(), 'logs');
  private readonly logRetentionDays = 7; // 🧹 giữ log trong 7 ngày

  constructor() {
    // Tạo thư mục logs nếu chưa có
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  private cleanOldLogs() {
    try {
      const files = fs.readdirSync(this.logDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);

        // Nếu là file và cũ hơn X ngày thì xóa
        const ageInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        if (ageInDays > this.logRetentionDays) {
          fs.unlinkSync(filePath);
          this.logger.log(`🧹 Deleted old log file: ${file}`);
        }
      }
    } catch (err) {
      this.logger.error(`Failed to clean old logs: ${err.message}`);
    }
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 🧱 Dọn log cũ mỗi lần ghi mới
    this.cleanOldLogs();

    // 🕒 2️⃣ Xác định file log theo ngày
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const logFilePath = path.join(this.logDir, `error-${dateStr}.log`);

    // 🧾 3️⃣ Tạo log message chi tiết
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception instanceof HttpException ? exception.getResponse() : exception;

    const message =
      typeof errorResponse === 'string' ? errorResponse : errorResponse?.message || 'Internal server error';

    const stack = exception?.stack || 'No stack trace';

    const logMessage = `
[${new Date().toISOString()}] ${request.method} ${request.url}
Status: ${status}
Message: ${message}
Request Body: ${JSON.stringify(request.body)}
Stack: ${stack}
---------------------------------------------------------------------------------------------------------------------------------------------
`;

    // 🪶 4️⃣ Ghi log ra file
    try {
      fs.appendFileSync(logFilePath, logMessage);
    } catch (err) {
      this.logger.error(`Failed to write error log: ${err.message}`);
    }

    // 🧩 5️⃣ In ra console (cho dev thấy)
    this.logger.error(`${request.method} ${request.url} → ${status} ${message}`);

    // ⚙️ 6️⃣ Format response như code gốc của bạn
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // ✅ Nếu là lỗi 400 (ValidationPipe)
      if (status === HttpStatus.BAD_REQUEST) {
        return response.status(status).json(exceptionResponse);
      }

      // ✅ Xử lý các lỗi khác (401, 403, 404, 500, ...)
      const resObj =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : (exceptionResponse as Record<string, any>);

      return response.status(status).json({
        status,
        error: resObj?.error || HttpStatus[status] || 'Error',
        message: resObj?.message || 'Error',
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // ✅ Lỗi không xác định (ngoài HttpException)
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || 'Internal server error',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
