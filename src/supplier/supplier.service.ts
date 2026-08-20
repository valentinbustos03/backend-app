import { EntityManager } from '@mikro-orm/core';
import { Supplier } from '../supplier/supplier.entity.js';
import {
  createSupplierDto,
  SupplierIdDto,
  UpdateSupplierDto,
} from './supplier.dto.js';

export class SupplierService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createSupplier(data: createSupplierDto): Promise<Supplier> {
    const newSupplier = this.em.create(Supplier, data);
    await this.em.persistAndFlush(newSupplier);
    return newSupplier;
  }

  async findAllSupplier(): Promise<Supplier[] | null> {
    const supplierList = this.em.findAll(Supplier);
    return supplierList;
  }

  async findSupplierById(id: SupplierIdDto): Promise<Supplier | null> {
    const supplier = this.em.findOne(Supplier, id);
    return supplier;
  }

  async findSupplierByTaxId(taxId: string): Promise<Supplier | null> {
    const supplier = await this.em.findOne(Supplier, { taxId });
    return supplier;
  }

  async updateSupplier(
    id: SupplierIdDto,
    data: UpdateSupplierDto
  ): Promise<Supplier | null> {
    const updatedSupplier = await this.em.findOne(Supplier, id);
    if (updatedSupplier) {
      this.em.assign(updatedSupplier, data);
      await this.em.flush();
      return updatedSupplier;
    } else {
      return null;
    }
  }

  async deleteSupplier(id: SupplierIdDto) {
    const deletedSupplier = await this.em.findOne(Supplier, id);
    if (deletedSupplier) {
      await this.em.removeAndFlush(deletedSupplier);
      return true;
    }
    return false;
  }
}
