import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public } from './modules/auth/public.decorator'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Public()
    healthCheck(): string {
        return this.appService.healthCheck()
    }
}
