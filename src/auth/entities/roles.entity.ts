import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('roles')
export class Roles{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        length: 60
    })
    nombre_rol: string;

    // @ManyToMany(
    //     () => User,
    //     user => user.
    // )


}