import { Module } from '@nestjs/common'
import { InvoiceController } from './invoice.controller'
import { InvoiceService } from './invoice.service'
import { LoggerModule } from '../logger/logger.module'

@Module({
    imports: [LoggerModule],
    controllers: [InvoiceController],
    providers: [InvoiceService],
})
export class InvoiceModule {}
