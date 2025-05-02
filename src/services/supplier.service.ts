//comportameientos de la entity supplier (CRUD+)
import { Supplier } from '../entities/supplier.entity.js';
import { EntityManager } from '@mikro-orm/core';

export class SupplierService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createSupplier(data: {
    id: number;
    companyName: string;
    taxId: string;
    mail: string;
    phoneNumber: string;
    typeIngredient: string;
    name: string;
    bussinessName: string;
  }): Promise<Supplier> {
    //crearProveedor - data = atributos
    const newSupplier = this.em.create(Supplier, data);
    await this.em.persistAndFlush(newSupplier);
    return newSupplier;
  } //newSupplier = nuevoProveedornode -v

  async findAllSupplier(): Promise<Supplier[] | null> {
    const supplierList = this.em.findAll(Supplier);
    return supplierList;
  }

  async findSupplierById(id: number): Promise<Supplier | null> {
    const supplier = this.em.findOne(Supplier, { id });
    return supplier;
  }

  async updateSupplier(
    id: number, 
    data: { companyName?: string; taxId?: string; mail?: string; phoneNumber?: string; typeIngredient?: string; name?: string; bussinessName?: string; }
  ): Promise<Supplier | null> {
    const updatedSupplier = await this.em.findOne(Supplier, { id });
    if (updatedSupplier) {
      this.em.assign(updatedSupplier, data);
      this.em.flush();
      return updatedSupplier;
    } else {
      return null;
    }
  }

  async deleteSupplier(id: number): Promise<Supplier | null> {
    const deletedSupplier = await this.em.findOne(Supplier, { id });
    if (deletedSupplier) {
      this.em.removeAndFlush(deletedSupplier);
      return deletedSupplier;
    } else {
      return null;
    }
  }
}
