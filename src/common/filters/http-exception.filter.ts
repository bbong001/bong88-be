import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      success: false, // Vì có lỗi xảy ra nên thành công sẽ là false
      data: null, // Không có dữ liệu khi xảy ra lỗi
      message: exception.message, // Sử dụng thông báo lỗi từ exception
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
