import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Invoice } from '../../entities/invoice.entity'
import {
    CreateInvoiceDto,
    FindInvoicesQueryParams,
    PaymentType,
    TogglePaymentDto,
    UpdateInvoiceDto,
} from './invoice.dto'
import { EntityManager, QueryOrder } from '@mikro-orm/postgresql'
import { User } from '../../entities/user.entity'
import { Patient } from '../../entities/patient.entity'
import { Insurance } from '../../entities/insurance.entity'
import { EmojiLogger } from '../logger/emoji-logger.service'

@Injectable()
export class InvoiceService {
    constructor(
        private readonly em: EntityManager,
        private readonly logger: EmojiLogger,
    ) {}

    async getInvoices(
        userId: number,
        queryParams: FindInvoicesQueryParams,
    ): Promise<{ data: Invoice[]; totalItems: number }> {
        this.logger.log('getInvoices', { userId, queryParams })
        const { limit, page, search, unpaid } = queryParams

        const where: any = { patient: { healthProfessional: { id: userId } } }

        if (search) {
            const ilikeSearch = { $ilike: `%${search}%` }
            where.patient.$or = [{ firstname: ilikeSearch }, { lastname: ilikeSearch }]
        }

        if (unpaid) {
            if (unpaid === PaymentType.socialSecurity) {
                where.isSocialSecurityPaid = false
                where.socialSecurityAmount = { $gt: 0 }
            } else if (unpaid === PaymentType.insurance) {
                where.isInsurancePaid = false
                where.insuranceAmount = { $gt: 0 }
            }
        }

        const [invoices, count] = await this.em.findAndCount(Invoice, where, {
            limit: limit,
            offset: limit * (page - 1),
            populate: ['patient', 'insurance'],
            fields: [
                'id',
                'date',
                'socialSecurityAmount',
                'insuranceAmount',
                'isSocialSecurityPaid',
                'isInsurancePaid',
                'createdAt',
                'patient.id',
                'patient.firstname',
                'patient.lastname',
                'insurance.id',
                'insurance.name',
            ],
            orderBy: { date: QueryOrder.DESC, id: QueryOrder.DESC },
        })

        return { data: invoices as Invoice[], totalItems: count }
    }

    async createInvoice(user: User, invoiceDto: CreateInvoiceDto): Promise<Invoice> {
        this.logger.log('createInvoice', { user, invoiceDto })
        const {
            socialSecurityAmount,
            insuranceAmount,
            isSocialSecurityPaid,
            isInsurancePaid,
            date,
            patientId,
            insuranceId,
        } = invoiceDto

        this.checkIfPatientBelongsToUserOrThrowError(user, patientId)

        const invoice = new Invoice({
            socialSecurityAmount: Math.floor(socialSecurityAmount * 100),
            insuranceAmount: Math.floor(insuranceAmount * 100),
            isSocialSecurityPaid: socialSecurityAmount > 0 ? isSocialSecurityPaid : false,
            isInsurancePaid: insuranceAmount > 0 ? isInsurancePaid : false,
            date,
            patient: this.em.getReference(Patient, patientId),
            insurance: insuranceId ? this.em.getReference(Insurance, insuranceId) : null,
        })

        try {
            await this.em.persistAndFlush(invoice)
            return invoice
        } catch (err) {
            this.logger.error('createInvoice', { user, invoiceDto, err })
            throw new InternalServerErrorException('Error creating invoice')
        }
    }

    async updateInvoice(invoiceId: number, user: User, invoiceDto: UpdateInvoiceDto): Promise<Invoice> {
        this.logger.log('updateInvoice', { invoiceId, user, invoiceDto })
        const invoice = await this.em.findOne(Invoice, { id: invoiceId })

        if (!invoice) {
            this.logger.error(`Invoice ${invoiceId} not found`, { invoiceId, user, invoiceDto })
            throw new NotFoundException(`Invoice ${invoiceId} not found`)
        }

        const {
            socialSecurityAmount,
            insuranceAmount,
            isSocialSecurityPaid,
            isInsurancePaid,
            date,
            patientId,
            insuranceId,
        } = invoiceDto

        if (patientId) {
            this.checkIfPatientBelongsToUserOrThrowError(user, patientId)

            invoice.patient = this.em.getReference(Patient, patientId)
        }

        if (socialSecurityAmount) invoice.socialSecurityAmount = Math.floor(socialSecurityAmount * 100)
        if (insuranceAmount) invoice.insuranceAmount = Math.floor(insuranceAmount * 100)
        if (date) invoice.date = date

        if (insuranceId > 0) {
            invoice.insurance = this.em.getReference(Insurance, insuranceId)
        } else if (insuranceId === 0) {
            invoice.insurance = null
        }

        if (isSocialSecurityPaid !== undefined) {
            invoice.isSocialSecurityPaid = invoice.socialSecurityAmount > 0 ? !!isSocialSecurityPaid : false
        }

        if (isInsurancePaid !== undefined) {
            invoice.isInsurancePaid = invoice.insuranceAmount > 0 ? !!isInsurancePaid : false
        }

        try {
            await this.em.persistAndFlush(invoice)
            return invoice
        } catch (err) {
            this.logger.error('updateInvoice', { invoiceId, user, invoiceDto, err })
            throw new InternalServerErrorException('Error updating invoice')
        }
    }

    async deleteInvoice(invoiceId: number, user: User): Promise<void> {
        this.logger.log('deleteInvoice', { invoiceId, user })
        const invoice = await this.em.findOne(Invoice, { id: invoiceId }, { populate: ['patient'] })

        if (!invoice) {
            this.logger.error(`Invoice ${invoiceId} not found`, { invoiceId, user })
            throw new NotFoundException(`Invoice ${invoiceId} not found`)
        }

        this.checkIfPatientBelongsToUserOrThrowError(user, invoice.patient.id)

        try {
            await this.em.removeAndFlush(invoice)
        } catch (err) {
            this.logger.error('deleteInvoice', { invoiceId, user, err })
            throw new InternalServerErrorException('Error deleting invoice')
        }
    }

    async toggleInvoicesPayment(togglePaymentDto: TogglePaymentDto): Promise<void> {
        this.logger.log('toggleInvoicesPayment', { togglePaymentDto })
        const { invoiceIds, paymentType } = togglePaymentDto
        const invoices = await this.em.find(Invoice, { id: { $in: invoiceIds } })

        if (!invoices.length) {
            this.logger.error(`Invoices ${invoiceIds.join(',')} not found`, { togglePaymentDto })
            throw new NotFoundException(`Invoices ${invoiceIds.join(',')} not found`)
        }

        if (paymentType === PaymentType.socialSecurity) {
            for (const invoice of invoices) {
                invoice.isSocialSecurityPaid = !invoice.isSocialSecurityPaid
            }
        } else if (paymentType === PaymentType.insurance) {
            for (const invoice of invoices) {
                invoice.isInsurancePaid = !invoice.isInsurancePaid
            }
        }

        try {
            await this.em.persistAndFlush(invoices)
        } catch (err) {
            this.logger.error('toggleInvoicesPayment', { togglePaymentDto, err })
            throw new InternalServerErrorException('Error toggling invoices payment')
        }
    }

    checkIfPatientBelongsToUserOrThrowError(user: User, patientId: number) {
        const currentUserPatientIds = user.patients.map((patient) => patient.id)
        if (!currentUserPatientIds.includes(patientId)) {
            this.logger.error(`This patient doesn't belong to this user.`, { user, patientId })
            throw new ForbiddenException(`This patient doesn't belong to this user.`)
        }
    }
}
