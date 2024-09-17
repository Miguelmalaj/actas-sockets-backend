import { Injectable, NotFoundException } from '@nestjs/common';
import { Meal } from '../models/meal.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class MealService {
    const 
  constructor(@InjectModel(Meal.name) private mealModel: Model<Meal>){
  }
  getAll(){
    return this.mealModel.find();
  }
  async insert(meal:Meal):Promise<Meal>{
    try{
        const newMeal=new this.mealModel(meal);
        return await newMeal.save();
    }catch(error){
        throw error;
    }
  }
  async updateMeal(id: string, updatedMealData: Partial<Meal>): Promise<Meal> {
    const updatedMeal = await this.mealModel.findByIdAndUpdate(id, updatedMealData, { new: true });
    return updatedMeal;
  }
  async deleteMeal(id: string): Promise<Meal> {
    const deletedMeal = await this.mealModel.findByIdAndDelete(id).exec();
    if (!deletedMeal) {
      throw new NotFoundException('Meal not found');
    }
    return deletedMeal;
  }
  async getAllByName(name: string): Promise<Meal[]> {
    const meals = await this.mealModel
      .find({ name: { $regex: name, $options: 'i' } })
      .exec();
    if (!meals || meals.length === 0) {
      throw new NotFoundException('No meals found with the given name');
    }
    return meals;
  }
  async getMealById(id: string): Promise<Meal> {
    const meal = await this.mealModel.findById(id).exec();
    if (!meal) {
      throw new NotFoundException('Meal not found');
    }
    return meal;
  }
  async getMealPagination(page: number): Promise<{ meals: Meal[]; totalItems: number }> {
    const totalItems = await this.mealModel.countDocuments();
    const meals = await this.mealModel
      .find()
      .skip((page - 1) * 10)
      .limit(10)
      .exec();

    return { meals, totalItems };
  }
}