import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Session {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  daytime: string;
  @Prop({ required: true })
  hall: number;
  @Prop({ required: true })
  rows: number;
  @Prop({ required: true })
  seats: number;
  @Prop({ required: true })
  price: number;
  @Prop({ type: [String], default: [], required: true })
  taken: string[];
}

@Schema()
export class Film extends Document {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  rating: string;
  @Prop({ required: true })
  director: string;
  @Prop({ type: [String], required: true })
  tags: string[];
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  about: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  image: string;
  @Prop({ required: true })
  cover: string;
  @Prop({ type: [Session], required: true })
  schedule: Session[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
