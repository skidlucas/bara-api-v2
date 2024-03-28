import { Body, Controller, Post } from '@nestjs/common'
import { PhysiotherapistService } from './physiotherapist.service'
import { PhysiotherapistSignUpDto } from './dto/physiotherapist-sign-up.dto'

@Controller('physio')
export class PhysiotherapistController {
    constructor(private physioService: PhysiotherapistService) {}

    @Post('sign-up')
    async signUp(@Body() physiotherapistSignUpDto: PhysiotherapistSignUpDto) {
        return this.physioService.signUp(physiotherapistSignUpDto)
    }
}
