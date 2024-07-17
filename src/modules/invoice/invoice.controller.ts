import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { User } from '../../entities/user.entity'
import { UserFromReq } from '../auth/user.decorator'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { CreateInvoiceDto, UpdateInvoiceDto } from './invoice.dto'

@Controller('invoices')
export class InvoiceController {
    constructor(private invoiceService: InvoiceService) {}

    @Get()
    getInvoices(@UserFromReq() user: User, @Paginate() paginateQuery: PaginateQuery) {
        return this.invoiceService.getInvoices(user.id, paginateQuery)
    }

    @Post()
    createInvoice(@UserFromReq() user: User, @Body() invoiceDto: CreateInvoiceDto) {
        return this.invoiceService.createInvoice(user, invoiceDto)
    }

    @Patch(':id')
    updateInvoice(@UserFromReq() user: User, @Param('id') invoiceId: number, @Body() invoiceDto: UpdateInvoiceDto) {
        return this.invoiceService.updateInvoice(invoiceId, user, invoiceDto)
    }
}
