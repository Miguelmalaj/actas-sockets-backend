import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../models/session.model';

@Injectable()
export class SessionService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) {}

  async createSession(userId: string, socketId: string, sessionType: 'http' | 'websocket') {
    // Elimina cualquier sesión activa previa del mismo tipo
    await this.deleteSession(userId, sessionType);

    // Crea una nueva sesión con el socketId
    const newSession = new this.sessionModel({
      userId,
      socketId,
      sessionType,
      isActive: true,
      createdAt: new Date(),
    });

    return newSession.save();
  }

  async deleteSession(userId: string, sessionType: 'http' | 'websocket') {
    await this.sessionModel.deleteMany({ userId, sessionType });
  }

  async getActiveWebSocketSession(userId: string): Promise<Session | null> {
    return this.sessionModel.findOne({ userId, sessionType: 'websocket', isActive: true });
  }
}
