import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { CreateUserDto, LoginUserDto, RegisterUserDto, UpdateAuthDto } from './dto';

@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService

  ){}


  async login(loginUserDto: LoginUserDto): Promise<LoginResponse>{

    const { usuario, password } = loginUserDto;

    const user = await this.usersRepository.findOne({
      where: {usuario},
      select: {id: true, usuario: true, password: true, nombre: true, email: true, telefono: true, numero_documento: true, isActive: true}
    })

    if(!user){
      throw new UnauthorizedException(`Credenciales no validas, el usuario no existe.`);
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Credenciales no validas, contraseña incorrecta.');
    }

    if(Number(user.isActive) !== 1){
      throw new UnauthorizedException('Su usuario no se encuentra activado.')
    }

    return {
      user,
      token: this.getJwtToken({
        id: user.id,
        usuario: user.usuario
      })
    }


  }

  async register(registerUserDto: RegisterUserDto): Promise<LoginResponse>{

    const user = await this.create(registerUserDto);

    return {
      user,
      token: this.getJwtToken({
        id: user.id,
        usuario: user.usuario
      })
    }

  }

  async create(createUserDto: CreateUserDto): Promise<User> {

    try {

      const { password, ...userData } = createUserDto;

      const user = this.usersRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.usersRepository.save(user);
      delete user.password;

      return {
        ...user
      }
      
    }catch(error){

      this.handleDBErrors(error);

      // console.log(error);
      // console.log(error.sqlState);
      // console.log(error.sqlMessage);

    }

  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async buscarUsuarioById(id: number){

    const user = await this.usersRepository.findOneBy({id: id});
    const { password, ...restUser } = user;
    return restUser;

  }
  

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);

    return token;

  }

  private handleDBErrors(error: any){

    if(error.sqlState === '23000'){
      console.log(error);
      throw new BadRequestException(`El Numero de Documento o el Usuario ya existe.`);
    }else{
      console.log(error);
      throw new InternalServerErrorException(`Por favor revisar el log del servidor`);
    }

  }


}
