import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { InvoiceService } from './invoice.service'
import { User } from '../../entities/user.entity'
import { UserFromReq } from '../auth/user.decorator'
import { CreateInvoiceDto, FindInvoicesQueryParams, TogglePaymentDto, UpdateInvoiceDto } from './invoice.dto'
import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql'
import { Invoice } from '../../entities/invoice.entity'

@Controller('invoices')
export class InvoiceController {
    constructor(
        private invoiceService: InvoiceService,
        private readonly orm: MikroORM,
    ) {}

    @Get()
    @CreateRequestContext()
    async getInvoices(
        @UserFromReq() user: User,
        @Query() queryParams: FindInvoicesQueryParams,
    ): Promise<{ data: Invoice[]; totalItems: number }> {
        return await this.invoiceService.getInvoices(user.id, queryParams)
    }

    @Post()
    @CreateRequestContext()
    async createInvoice(@UserFromReq() user: User, @Body() invoiceDto: CreateInvoiceDto): Promise<Invoice> {
        return await this.invoiceService.createInvoice(user, invoiceDto)
    }

    @Patch('toggle-payment')
    @CreateRequestContext()
    async toggleInvoicesPayment(@Body() togglePaymentDto: TogglePaymentDto): Promise<void> {
        await this.invoiceService.toggleInvoicesPayment(togglePaymentDto)
    }

    @Patch(':id')
    @CreateRequestContext()
    async updateInvoice(
        @UserFromReq() user: User,
        @Param('id') invoiceId: number,
        @Body() invoiceDto: UpdateInvoiceDto,
    ): Promise<Invoice> {
        return await this.invoiceService.updateInvoice(invoiceId, user, invoiceDto)
    }

    @Delete(':id')
    @CreateRequestContext()
    async deleteInvoice(@UserFromReq() user: User, @Param('id') invoiceId: number): Promise<void> {
        return await this.invoiceService.deleteInvoice(invoiceId, user)
    }
}
