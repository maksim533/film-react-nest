import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('films')
export class FilmMongoEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  id: string;

  @Column('float')
  rating: number;

  @Column()
  director: string;

  @Column('text')
  tags: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @Column(() => ScheduleMongoEntity)
  schedule: ScheduleMongoEntity[];
}

export class ScheduleMongoEntity {
  @Column()
  id: string;

  @Column()
  daytime: string;

  @Column('int')
  hall: number;

  @Column('int')
  rows: number;

  @Column('int')
  seats: number;

  @Column('float')
  price: number;

  @Column()
  taken: string[];
}
