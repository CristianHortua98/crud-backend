import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuarios')
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        length: 60
    })
    nombre: string;

    @Column({
        type: 'bigint',
        unique: true
    })
    numero_documento: number;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true
    })
    usuario: string;

    @Column({
        type: 'text',
        select: false // NO MOSTRAMOS CONTRASEÑA CUANDO SE MUESTE LA INFORMACION CON LAS RELACIONES  
    })
    password: string;

    @Column({
        type: 'text'
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 15
    })
    telefono: number;

    @Column({
        type: 'int',
        default: 1
    })
    isActive: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    fecha_crea: Date;


}
