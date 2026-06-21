import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ExtractIdInterceptor implements NestInterceptor {
  constructor(private readonly idKey: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const id = request.params?.[this.idKey];

    if (id) {
      request.body[this.idKey] = id;
    }

    return next.handle();
  }

  static for(idKey: string) {
    return new ExtractIdInterceptor(idKey);
  }
}
