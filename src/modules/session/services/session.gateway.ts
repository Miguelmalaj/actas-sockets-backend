import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from './session.service';
import { AuthService } from 'src/modules/auth/services/auth.service';

@WebSocketGateway()
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly sessionsService: SessionService,
    private readonly authService: AuthService
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    console.log('# New WebSocket connection attempt with token:', token);

    if (token) {
      // Validar el token para extraer el userId
      const decodedToken = await this.authService.validateToken(token);
      if (!decodedToken) {
        console.log('Invalid token provided, closing connection.');
        client.disconnect(); // Desconecta si el token es inválido
        return;
      }

      const userId = decodedToken.userId;
      console.log('# Checking active WebSocket session for userId:', userId);
      const existingSession = await this.sessionsService.getActiveWebSocketSession(userId);

      if (existingSession) {
        console.log(`# User ${userId} already has an active WebSocket session. Disconnecting previous session.`);
        this.server.sockets.sockets.get(existingSession.socketId)?.disconnect(); // Desconecta la sesión WebSocket anterior
        // Eliminar la sesión anterior
        await this.sessionsService.deleteSession(userId, 'websocket');
      }

      // Crear y registrar la nueva sesión WebSocket
      console.log(`# Creating new WebSocket session for userId: ${userId}`);
      await this.sessionsService.createSession(userId, client.id, 'websocket');
      console.log(`# WebSocket session created successfully for userId: ${userId} with socketId: ${client.id}`);
    } else {
      console.log('# No token provided, closing connection.');
      client.disconnect(); // Desconecta si no hay token
    }
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.query.token as string;
    console.log('# Client disconnected with token:', token);

    if (token) {
      // Validar el token para extraer el userId
      const decodedToken = await this.authService.validateToken(token);
      if (decodedToken) {
        const userId = decodedToken.userId;
        console.log(`# Deleting WebSocket session for userId: ${userId}`);
        // Eliminar la sesión de la base de datos
        await this.sessionsService.deleteSession(userId, 'websocket');
      }
    }
  }
}
