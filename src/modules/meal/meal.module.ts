import {Module} from '@nestjs/common';
import { MealController } from './controllers/meal.controller';
import { MealService } from './services/meal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Meal, MealSchema } from './models/meal.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../guards/auth.guard';

@Module({
    imports:[
        MongooseModule.forFeature([
            { name: Meal.name, schema: MealSchema }
        ]),
        AuthModule
    ],
    controllers:[MealController],
    providers:[
        MealService,
        JwtAuthGuard
    ]
})
export class MealModule{}