import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './models/session.model';
import { SessionGateway } from './services/session.gateway';
import { SessionService } from './services/session.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    forwardRef(() => AuthModule)
  ],
  providers: [SessionService, SessionGateway],
  exports: [SessionService],
})
export class SessionModule {}
