import { Injectable } from '@nestjs/common'
import { Invoice } from '../../entities/invoice.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate'

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
}
