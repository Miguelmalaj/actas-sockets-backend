import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model,model,models } from 'mongoose';

@Schema()
export class Meal extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;
  
}
export const MealSchema= (mongoose.models.Meal || SchemaFactory.createForClass(Meal))as Model<Meal>
