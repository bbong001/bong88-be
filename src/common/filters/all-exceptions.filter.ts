import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { error } from 'console';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Kiểm tra xem exception có phải là HttpException không
    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Mặc định là 500
    let message: any = 'Unknown error occurred'; // Thông điệp mặc định
    let errorCode = 0;

    if (exception instanceof HttpException) {
      status = exception.getStatus(); // Lấy mã trạng thái từ HttpException
      const _response = exception.getResponse(); // Lấy thông điệp từ HttpException
      // Nếu message không phải là string, có thể lấy từ message property
      if (typeof _response !== 'string') {
        message = (_response as any).message || 'Unknown error occurred';
        errorCode = (_response as any).errorCode;
      }
    } else if (exception instanceof Error) {
      message = exception.message; // Lấy thông điệp từ đối tượng Error
    }

    response.status(status).json({
      statusCode: status,
      errorCode: errorCode,
      success: false,
      data: null,
      message: message,
      timestamp: new Date().toISOString(),
      // path: request.url,
    });
  }
}
