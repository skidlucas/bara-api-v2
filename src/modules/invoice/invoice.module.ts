import { Module } from '@nestjs/common'
import { InvoiceController } from './invoice.controller'
import { InvoiceService } from './invoice.service'
import { Invoice } from '../../entities/invoice.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
    imports: [MikroOrmModule.forFeature([Invoice])],
    controllers: [InvoiceController],
    providers: [InvoiceService],
})
export class InvoiceModule {}
