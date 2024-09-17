import { Controller, Get, Post, Body, HttpCode, UnauthorizedException, Patch, Param, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { SessionService } from 'src/modules/session/services/session.service';
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService, private authService: AuthService,
        private sessionsService: SessionService,
    ) {

    }
    @Post('login')
    @HttpCode(200)
    async login(@Body() data: User) {
        const user = await this.userService.getUser(data);

        if (user) {
            // Genera el token de acceso (JWT) utilizando el userId
            const accessToken = await this.authService.generateToken({ userId: user._id });

            // Convert ObjectId to a string
            const userIdString = user._id.toString();

            // Crea una sesión de tipo 'http' para la autenticación
            // await this.sessionsService.createSession(user._id, accessToken, 'http');
            await this.sessionsService.createSession(userIdString, accessToken, 'http');

            const { folio, reverso, reversoFolio, marco, marcoFolioReverso, marcoReverso, isAdmin } = user;
            // Devuelve el accessToken y el userId
            return {
                accessToken,
                folio, reverso, reversoFolio, marco, marcoFolioReverso, marcoReverso, isAdmin
            };
        }

        // Si las credenciales no son válidas, lanza una excepción de autenticación
        throw new UnauthorizedException('Credenciales inválidas');
    }

    @Get('users')
    @HttpCode(200)
    async getUsers() {
        const users = await this.userService.getAllUsers();
        return users;
    }

    @Patch('users/:id')
    async updateUserById( @Param('id') id: string, @Body() updatedUserData: Partial<User> ) {
            
        const booleanKeys = ['folio', 'reverso', 'reversoFolio', 'marco', 'marcoFolioReverso', 'marcoReverso'];
        delete updatedUserData['_id'];
        delete updatedUserData['username'];

        booleanKeys.forEach((key) => {
            if (updatedUserData[key] === 'true') {
                updatedUserData[key] = true;
            } else if (updatedUserData[key] === 'false') {
                updatedUserData[key] = false;
            }
            });

        const result = await this.userService.updateUser(id, updatedUserData);
        return result
        
    }
}