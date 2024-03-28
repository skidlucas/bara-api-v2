import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PhysiotherapistSignUpDto } from './dto/physiotherapist-sign-up.dto';
import { Physiotherapist } from '../../entities/physiotherapist.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../../utils/utils';

@Injectable()
export class PhysiotherapistService {
  constructor(
    @InjectRepository(Physiotherapist)
    private physioRepository: Repository<Physiotherapist>,
  ) {}
  async signUp(physiotherapistSignUpDto: PhysiotherapistSignUpDto) {
    const { email, password, firstname, lastname } = physiotherapistSignUpDto;

    const physio = new Physiotherapist({
      email,
      firstname,
      lastname,
      password: hashPassword(password),
    });

    try {
      await this.physioRepository.save(physio);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate email
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
