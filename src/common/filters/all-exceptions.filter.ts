import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Kiểm tra xem exception có phải là HttpException không
    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Mặc định là 500
    let message: any = 'Unknown error occurred'; // Thông điệp mặc định

    if (exception instanceof HttpException) {
      status = exception.getStatus(); // Lấy mã trạng thái từ HttpException
      message = exception.getResponse(); // Lấy thông điệp từ HttpException
      // Nếu message không phải là string, có thể lấy từ message property
      if (typeof message !== 'string') {
        message = (message as any).message || 'Unknown error occurred';
      }
    } else if (exception instanceof Error) {
      message = exception.message; // Lấy thông điệp từ đối tượng Error
    }

    response.status(status).json({
      statusCode: status,
      success: false,
      data: null, // Không có dữ liệu khi xảy ra lỗi
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
