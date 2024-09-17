import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
@Schema()
export class User {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    // _id should be of type ObjectId (default in MongoDB)
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    _id: mongoose.Schema.Types.ObjectId;

    // Adding new boolean fields
    @Prop({ type: Boolean, default: true })
    folio: boolean;

    @Prop({ type: Boolean, default: false })
    reverso: boolean;

    @Prop({ type: Boolean, default: false })
    reversoFolio: boolean;

    @Prop({ type: Boolean, default: false })
    marco: boolean;

    @Prop({ type: Boolean, default: false })
    marcoFolioReverso: boolean;

    @Prop({ type: Boolean, default: false })
    marcoReverso: boolean;
    
    @Prop({ type: Boolean, default: false })
    isAdmin: boolean;
}
export const UserSchema = (mongoose.models.User || SchemaFactory.createForClass(User)) as Model<User>;