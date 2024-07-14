import { Controller, Get } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { User } from '../../entities/user.entity'
import { UserFromReq } from '../auth/user.decorator'
import { Paginate, PaginateQuery } from 'nestjs-paginate'

@Controller('invoices')
export class InvoiceController {
    constructor(private invoiceService: InvoiceService) {}

    @Get()
    getInvoices(@UserFromReq() user: User, @Paginate() paginateQuery: PaginateQuery) {
        return this.invoiceService.getInvoices(user.id, paginateQuery)
    }
}
