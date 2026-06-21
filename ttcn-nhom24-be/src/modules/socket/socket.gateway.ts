import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' }, // Cho phép mọi domain connect (tùy chỉnh theo nhu cầu)
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly socketService: SocketService) {}
  private readonly logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: Server;

  // Sau khi server socket khởi tạo
  afterInit() {
    this.socketService.setServer(this.server);
    this.logger.verbose('Socket server initialized');
  }

  // Khi client kết nối
  handleConnection(client: Socket) {
    this.logger.warn(`Client connected: ${client.id}`);
  }

  // Khi client ngắt kết nối
  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
  }

  // ---------------------------
  // 1. Client join vào room (ví dụ: join vào phòng "Lớp 12A")
  // ---------------------------
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room);
    client.emit('joinedRoom', `✅ Bạn đã tham gia phòng: ${room}`);
    this.server.to(room).emit('systemMessage', `👤 ${client.id} vừa tham gia phòng`);
  }

  // ---------------------------
  // 2. Client rời room (ví dụ: rời khỏi lớp học online)
  // ---------------------------
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.leave(room);
    client.emit('leftRoom', `❌ Bạn đã rời phòng: ${room}`);
    this.server.to(room).emit('systemMessage', `👋 ${client.id} đã rời phòng`);
  }

  // ---------------------------
  // 3. Gửi tin nhắn trong 1 room (chat nhóm)
  // ---------------------------
  @SubscribeMessage('sendRoomMessage')
  handleRoomMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; msg: string },
  ) {
    this.server.to(payload.room).emit('roomMessage', {
      sender: client.id,
      message: payload.msg,
    });
  }

  // ---------------------------
  // 4. Gửi broadcast toàn hệ thống (vd: thông báo downtime server)
  // ---------------------------
  @SubscribeMessage('broadcastMessage')
  handleBroadcastMessage(@ConnectedSocket() client: Socket, @MessageBody() msg: string) {
    client.broadcast.emit('broadcastMessage', {
      sender: client.id,
      message: msg,
    });
  }

  // ---------------------------
  // 5. Gửi tin nhắn riêng cho 1 client (chat riêng giữa 2 người)
  // ---------------------------
  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetId: string; msg: string },
  ) {
    this.server.to(payload.targetId).emit('privateMessage', {
      from: client.id,
      message: payload.msg,
    });
  }

  // ---------------------------
  // 6. Gửi tin tới nhiều room (vd: thông báo "Thứ 2 nghỉ học" cho nhiều lớp)
  // ---------------------------
  @SubscribeMessage('multiRoomMessage')
  handleMultiRoomMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { rooms: string[]; msg: string },
  ) {
    this.server.to(payload.rooms).emit('multiRoomMessage', {
      sender: client.id,
      message: payload.msg,
    });
  }

  // ---------------------------
  // 7. Gửi tin trong 1 room nhưng không cho sender thấy
  // (vd: giáo viên hỏi bài, không muốn hiện lại tin cho chính mình)
  // ---------------------------
  @SubscribeMessage('roomMessageExcludeSender')
  handleRoomMessageExcludeSender(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; msg: string },
  ) {
    client.to(payload.room).emit('roomMessageExcludeSender', {
      sender: client.id,
      message: payload.msg,
    });
  }

  // ---------------------------
  // 8. Lấy danh sách các room mà client đang tham gia
  // (vd: 1 học sinh có thể vừa trong "Lớp 12A" vừa trong "CLB Bóng đá")
  // ---------------------------
  @SubscribeMessage('getMyRooms')
  handleGetMyRooms(@ConnectedSocket() client: Socket) {
    client.emit('myRooms', Array.from(client.rooms)); // client.rooms là Set<string>
  }

  // ---------------------------
  // 9. Lấy danh sách thành viên trong 1 room (vd: điểm danh lớp học)
  // ---------------------------
  @SubscribeMessage('getRoomMembers')
  async handleGetRoomMembers(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    const sockets = await this.server.in(room).fetchSockets();
    client.emit(
      'roomMembers',
      sockets.map((s) => s.id),
    );
  }

  // ---------------------------
  // 10. Ngắt kết nối 1 client (vd: kick học sinh spam khỏi lớp)
  // ---------------------------
  @SubscribeMessage('forceDisconnect')
  handleForceDisconnect(@ConnectedSocket() client: Socket, @MessageBody() targetId: string) {
    const targetSocket = this.server.sockets.sockets.get(targetId);
    if (targetSocket) {
      targetSocket.disconnect();
      client.emit('forceDisconnectAck', `✅ Đã ngắt kết nối ${targetId}`);
    } else {
      client.emit('forceDisconnectAck', `❌ Không tìm thấy client ${targetId}`);
    }
  }

  // ---------------------------
  // 11. Ping/Pong với ACK (vd: kiểm tra độ trễ mạng)
  // ---------------------------
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() payload: any): any {
    return { pong: true, time: Date.now(), payload };
  }
}
