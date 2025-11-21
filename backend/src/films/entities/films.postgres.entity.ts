import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('films')
export class FilmPostgresEntity {
  @PrimaryGeneratedColumn('uuid')
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

  @OneToMany(() => SchedulePostgresEntity, (schedule) => schedule.film, {
    cascade: true,
  })
  schedule: SchedulePostgresEntity[];
}

@Entity('schedules')
export class SchedulePostgresEntity {
  @PrimaryGeneratedColumn('uuid')
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

  @Column('text')
  taken: string;

  @ManyToOne(() => FilmPostgresEntity, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film: FilmPostgresEntity;
}
