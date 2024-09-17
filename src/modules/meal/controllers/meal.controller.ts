import { Controller, Get, Post, Body, HttpCode,UseGuards,Put,Param,Res, HttpException, HttpStatus,Delete, NotFoundException, Patch } from '@nestjs/common';
import { MealService } from '../services/meal.service';
import { Meal } from '../models/meal.model';
import { JwtAuthGuard } from 'src/modules/guards/auth.guard';

@Controller('meals')
@UseGuards(JwtAuthGuard)
export class MealController {
    constructor(private mealService:MealService){}
    
  @Get()
  obtenerDatos() {
    return this.mealService.getAll();
  }

  @Post('insert')
  @HttpCode(200)
  insert(@Body() data: Meal) {
    try{
        delete data['_id'];
        console.log(data)
        return this.mealService.insert(data);
    }catch(error){
        throw  new HttpException({message:'Error al guardar'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatedMealData: Partial<Meal>){
    try{
        const update=await this.mealService.updateMeal(id,updatedMealData);
        return update;
    }catch(error){
        throw new HttpException({message:'Error al actualizar'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete(':id')
  async deleteMeal(@Param('id') id: string): Promise<Meal> {
    try {
      const deletedMeal = await this.mealService.deleteMeal(id);
      return deletedMeal;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({message:error.message});
      }
      throw error;
    }
  }
  @Get('getAllByName/:name')
  async getAllByName(@Param('name') name: string): Promise<Meal[]> {
    try {
      const meals = await this.mealService.getAllByName(name);
      return meals;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  @Get(':id')
  async getMealById(@Param('id') id: string): Promise<Meal> {
    try {
      const meal = await this.mealService.getMealById(id);
      if (!meal) {
        throw new NotFoundException('Meal not found');
      }
      return meal;
    } catch (error) {
      throw error;
    }
  }
  @Get('pagination/:page')
  async getMealPagination(@Param('page') page: number): Promise<any> {
    try {

      const { meals, totalItems } = await this.mealService.getMealPagination(page);

      const totalPages = Math.ceil(totalItems / 10);
      const hasNextPage = 10 * page < totalItems;
      const hasPrevPage = page > 1;
      const nextPage = page++;
      const prevPage = page--;

      return {
        meals,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
      };
    } catch (error) {
      throw error;
    }
  }
}