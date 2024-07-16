import { ForbiddenException, Injectable } from '@nestjs/common'
import { Invoice } from '../../entities/invoice.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate'
import { CreateInvoiceDto } from './invoice.dto'
import { User } from '../../entities/user.entity'

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        // private patientsService: PatientsService,
        // private insurancesService: InsurancesService,
    ) {}

    async getInvoices(userId: number, paginateQuery: PaginateQuery): Promise<Paginated<Invoice>> {
        return paginate(paginateQuery, this.invoiceRepository, {
            relations: ['patient', 'insurance'],
            where: {
                patient: { healthProfessionalId: userId },
            },
            sortableColumns: ['id', 'date'],
            nullSort: 'last',
            defaultSortBy: [['date', 'DESC']],
            searchableColumns: ['patient.firstname', 'patient.lastname', 'insurance.name'],
            select: [
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
            filterableColumns: {
                isSocialSecurityPaid: [FilterOperator.EQ],
                socialSecurityAmount: [FilterOperator.GT],
                isInsurancePaid: [FilterOperator.EQ],
                insuranceAmount: [FilterOperator.GT],
            },
        })
    }

    async createInvoice(user: User, createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
        const {
            socialSecurityAmount,
            insuranceAmount,
            isSocialSecurityPaid,
            isInsurancePaid,
            date,
            patientId,
            insuranceId,
        } = createInvoiceDto

        const currentUserPatientIds = user.patients.map((patient) => patient.id)
        if (!currentUserPatientIds.includes(patientId)) {
            throw new ForbiddenException(`This patient doesn't belong to this user.`)
        }

        const invoice = new Invoice({
            socialSecurityAmount: Math.floor(socialSecurityAmount * 100),
            insuranceAmount: Math.floor(insuranceAmount * 100),
            isSocialSecurityPaid,
            isInsurancePaid,
            date,
            patientId,
            insuranceId,
        })

        try {
            return await this.invoiceRepository.save(invoice)
        } catch (err) {
            console.error(err)
        }
    }
}
