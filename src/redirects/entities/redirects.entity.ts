import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Redirect {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    full_url: string;

    @Column('text')
    referrer: string;

    @Column({ type: 'integer', unsigned: true, default: 0 })
    hit_counts: number;

}