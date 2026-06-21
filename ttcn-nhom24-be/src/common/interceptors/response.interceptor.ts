import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNil } from 'lodash';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        if (isNil(data)) {
          return {
            status: res.statusCode,
            error: false,
            message: 'Success',
          };
        }

        return {
          status: res.statusCode,
          error: false,
          message: 'Success',
          data: data,
        };
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
