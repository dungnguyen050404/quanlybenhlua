import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private socketServer: Server;

  setServer(server: Server) {
    this.socketServer = server;
  }

  getServer(): Server {
    if (!this.socketServer) {
      throw new HttpException(
        'Socket server chưa được khởi tạo',
        HttpStatus.SERVICE_UNAVAILABLE, // 503
      );
    }
    return this.socketServer;
  }
}
