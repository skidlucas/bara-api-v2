import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Invoice } from '../../entities/invoice.entity'
import { CreateInvoiceDto, FindInvoicesQueryParams, TogglePaymentDto, UpdateInvoiceDto } from './invoice.dto'
import { EntityManager, QueryOrder } from '@mikro-orm/postgresql'
import { User } from '../../entities/user.entity'
import { Patient } from '../../entities/patient.entity'
import { Insurance } from '../../entities/insurance.entity'

@Injectable()
export class InvoiceService {
    constructor(
        private readonly em: EntityManager,
        // private patientsService: PatientsService,
        // private insurancesService: InsurancesService,
    ) {}

    async getInvoices(
        userId: number,
        queryParams: FindInvoicesQueryParams,
    ): Promise<{ data: Invoice[]; totalItems: number }> {
        const { limit, page, search, unpaid } = queryParams

        const where: any = { patient: { healthProfessional: { id: userId } } }

        if (search) {
            const ilikeSearch = { $ilike: `%${search}%` }
            where.patient.$or = [{ firstname: ilikeSearch }, { lastname: ilikeSearch }]
        }

        if (unpaid) {
            if (unpaid === 'socialSecurity') {
                where.isSocialSecurityPaid = false
                where.socialSecurityAmount = { $gt: 0 }
            } else if (unpaid === 'insurance') {
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
            console.error(err)
        }
    }

    async updateInvoice(invoiceId: number, user: User, invoiceDto: UpdateInvoiceDto): Promise<Invoice> {
        const invoice = await this.em.findOne(Invoice, { id: invoiceId })

        if (!invoice) {
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
            console.error(err)
        }
    }

    async deleteInvoice(invoiceId: number, user: User): Promise<void> {
        const invoice = await this.em.findOne(Invoice, { id: invoiceId }, { populate: ['patient'] })

        if (!invoice) {
            throw new NotFoundException(`Invoice ${invoiceId} not found`)
        }

        this.checkIfPatientBelongsToUserOrThrowError(user, invoice.patient.id)

        try {
            await this.em.removeAndFlush(invoice)
        } catch (err) {
            console.error(err)
        }
    }

    async toggleInvoicesPayment(togglePaymentDto: TogglePaymentDto): Promise<void> {
        const { invoiceIds, paymentType } = togglePaymentDto
        const invoices = await this.em.find(Invoice, { id: { $in: invoiceIds } })

        if (!invoices.length) {
            throw new NotFoundException(`Invoices ${invoiceIds.join(',')} not found`)
        }

        if (paymentType === 'socialSecurity') {
            for (const invoice of invoices) {
                invoice.isSocialSecurityPaid = !invoice.isSocialSecurityPaid
            }
        } else if (paymentType === 'insurance') {
            for (const invoice of invoices) {
                invoice.isInsurancePaid = !invoice.isInsurancePaid
            }
        }

        try {
            await this.em.persistAndFlush(invoices)
        } catch (err) {
            console.error(err)
        }
    }

    checkIfPatientBelongsToUserOrThrowError(user: User, patientId: number) {
        const currentUserPatientIds = user.patients.map((patient) => patient.id)
        if (!currentUserPatientIds.includes(patientId)) {
            throw new ForbiddenException(`This patient doesn't belong to this user.`)
        }
    }
}
