import { catalogDb } from './db';
import { CatalogProduct, catalogProductToPublicProduct } from '../types/catalog';
import { FIVE_PILOT_TEMPLATES, convertMockProductsToCatalogProducts } from '../data/pilotTemplates';
import { Product } from '../types';

export interface ProductFilterParams {
  status?: string;
  categoryId?: string;
  brandName?: string;
  level?: string;
  missingImages?: boolean;
  missingRuTranslation?: boolean;
  missingPrice?: boolean;
  missingStock?: boolean;
  missingDocs?: boolean;
  demoOnly?: boolean;
  validatedOnly?: boolean;
  searchQuery?: string;
}

class ProductRepositoryService {
  private isInitialized = false;

  async initStoreIfNeeded(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const existing = await catalogDb.getAll<CatalogProduct>('products');
      if (!existing || existing.length === 0) {
        console.log('Seeding initial Catalog Pilot products into IndexedDB...');
        const initialProducts = convertMockProductsToCatalogProducts();

        for (const prod of initialProducts) {
          await catalogDb.put('products', prod);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('IndexedDB initial seed failed or unavailable, falling back:', e);
      this.isInitialized = true;
    }
  }

  async getAllProducts(): Promise<CatalogProduct[]> {
    await this.initStoreIfNeeded();
    try {
      const products = await catalogDb.getAll<CatalogProduct>('products');
      if (products && products.length > 0) return products;
    } catch (e) {
      console.error('Error fetching products from db:', e);
    }
    return convertMockProductsToCatalogProducts();
  }

  async getPublishedProducts(lang: 'ro' | 'ru' = 'ro'): Promise<Product[]> {
    const all = await this.getAllProducts();
    // Return active, demo, or review products for public viewing
    const visible = all.filter(p => p.status === 'active' || p.status === 'demo');
    return visible.map(catProd => catalogProductToPublicProduct(catProd, lang));
  }

  async getProductById(id: string): Promise<CatalogProduct | null> {
    await this.initStoreIfNeeded();
    try {
      const prod = await catalogDb.getById<CatalogProduct>('products', id);
      if (prod) return prod;
    } catch (e) {
      console.error(`Error fetching product ${id}:`, e);
    }
    const all = await this.getAllProducts();
    return all.find(p => p.id === id) || null;
  }

  async getProductBySlug(slug: string): Promise<CatalogProduct | null> {
    const all = await this.getAllProducts();
    return all.find(p => p.slug === slug || p.id === slug) || null;
  }

  async createProduct(product: Partial<CatalogProduct>): Promise<CatalogProduct> {
    await this.initStoreIfNeeded();
    const id = product.id || `prod-pilot-${Date.now()}`;
    const now = new Date().toISOString();

    const fullProduct: CatalogProduct = {
      id,
      slug: product.slug || `produs-${id}`,
      sku: product.sku || `SKU-${Date.now().toString().slice(-6)}`,
      barcode: product.barcode || '',
      brandId: product.brandId || (product.brandName ? product.brandName.toLowerCase() : 'generic'),
      brandName: product.brandName || 'Generat',
      categoryId: product.categoryId || 'general',
      categoryName: product.categoryName || { ro: 'General', ru: 'Общее' },
      status: product.status || 'draft',
      dataValidationStatus: product.dataValidationStatus || 'draft',
      inventoryStatus: product.inventoryStatus || 'test',
      level: product.level || 'standard',
      name: product.name || { ro: 'Produs Nou Pilot', ru: 'Новый пилотный товар' },
      shortDescription: product.shortDescription || { ro: '', ru: '' },
      fullDescription: product.fullDescription || { ro: '', ru: '' },
      benefits: product.benefits || { ro: [], ru: [] },
      applications: product.applications || { ro: [], ru: [] },
      limitations: product.limitations || { ro: [], ru: [] },
      warnings: product.warnings || { ro: [], ru: [] },
      salesUnit: product.salesUnit || 'bag',
      salesUnitDisplay: product.salesUnitDisplay || { ro: 'bucată', ru: 'штука' },
      packageQuantity: product.packageQuantity || 1,
      packageWeightKg: product.packageWeightKg,
      packageVolumeL: product.packageVolumeL,
      consumptionPerSqM: product.consumptionPerSqM,
      consumptionUnit: product.consumptionUnit,
      logistics: product.logistics || {
        weightKg: 1,
        heavyProduct: false,
        bulkyProduct: false,
        lockerEligible: true,
        craneDeliveryRecommended: false
      },
      price: product.price || {
        currency: 'MDL',
        vatRate: 0.20,
        regularPrice: 100,
        promotionActive: false,
        packageDiscountEligible: true
      },
      inventory: product.inventory || [
        { storeId: 'cahul', storeName: 'CodeBau Cahul', physicalStock: 50, reservedStock: 0, availableOnline: 50, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
        { storeId: 'cantemir', storeName: 'CodeBau Cantemir', physicalStock: 20, reservedStock: 0, availableOnline: 20, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
        { storeId: 'vulcanesti', storeName: 'CodeBau Vulcănești', physicalStock: 15, reservedStock: 0, availableOnline: 15, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
        { storeId: 'taraclia', storeName: 'CodeBau Taraclia', physicalStock: 25, reservedStock: 0, availableOnline: 25, pickupEnabled: true, deliveryEnabled: true, status: 'test' }
      ],
      images: product.images || [],
      documents: product.documents || [],
      technicalAttributes: product.technicalAttributes || [],
      searchTerms: product.searchTerms || { ro: [], ru: [] },
      complementaryProductIds: product.complementaryProductIds || [],
      similarProductIds: product.similarProductIds || [],
      alternativeProductIds: product.alternativeProductIds || {},
      projectIds: product.projectIds || [],
      calculatorIds: product.calculatorIds || [],
      packageIds: product.packageIds || [],
      createdAt: now,
      updatedAt: now
    };

    try {
      await catalogDb.put('products', fullProduct);
    } catch (e) {
      console.error('Error saving new product to db:', e);
    }
    return fullProduct;
  }

  async updateProduct(product: CatalogProduct): Promise<CatalogProduct> {
    await this.initStoreIfNeeded();
    const updated: CatalogProduct = {
      ...product,
      updatedAt: new Date().toISOString()
    };
    try {
      await catalogDb.put('products', updated);
    } catch (e) {
      console.error('Error updating product in db:', e);
    }
    return updated;
  }

  async duplicateProduct(id: string): Promise<CatalogProduct | null> {
    const original = await this.getProductById(id);
    if (!original) return null;

    const copy: CatalogProduct = {
      ...JSON.parse(JSON.stringify(original)),
      id: `prod-pilot-${Date.now()}`,
      sku: `COPY-${original.sku || Date.now().toString().slice(-4)}`,
      slug: `${original.slug}-copie-${Date.now().toString().slice(-4)}`,
      name: {
        ro: `${original.name.ro} (Copie)`,
        ru: `${original.name.ru} (Копия)`
      },
      status: 'draft',
      dataValidationStatus: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: undefined
    };

    return this.createProduct(copy);
  }

  async publishProduct(id: string): Promise<CatalogProduct | null> {
    const prod = await this.getProductById(id);
    if (!prod) return null;

    prod.status = 'active';
    prod.publishedAt = new Date().toISOString();
    return this.updateProduct(prod);
  }

  async unpublishProduct(id: string): Promise<CatalogProduct | null> {
    const prod = await this.getProductById(id);
    if (!prod) return null;

    prod.status = 'inactive';
    return this.updateProduct(prod);
  }

  async archiveProduct(id: string): Promise<CatalogProduct | null> {
    const prod = await this.getProductById(id);
    if (!prod) return null;

    prod.status = 'archived';
    return this.updateProduct(prod);
  }

  async deleteDraftProduct(id: string): Promise<boolean> {
    const prod = await this.getProductById(id);
    if (!prod) return false;
    if (prod.status !== 'draft') {
      throw new Error('Numai produsele în stadiu Draft pot fi șterse definitiv.');
    }
    try {
      await catalogDb.delete('products', id);
      return true;
    } catch (e) {
      console.error(`Error deleting product ${id}:`, e);
      return false;
    }
  }

  async searchProducts(params: ProductFilterParams): Promise<CatalogProduct[]> {
    let all = await this.getAllProducts();

    if (params.status && params.status !== 'all') {
      all = all.filter(p => p.status === params.status);
    }

    if (params.categoryId && params.categoryId !== 'all') {
      all = all.filter(p => p.categoryId === params.categoryId);
    }

    if (params.brandName && params.brandName !== 'all') {
      all = all.filter(p => p.brandName.toLowerCase() === params.brandName.toLowerCase());
    }

    if (params.level && params.level !== 'all') {
      all = all.filter(p => p.level === params.level);
    }

    if (params.missingImages) {
      all = all.filter(p => !p.images || p.images.length === 0);
    }

    if (params.missingRuTranslation) {
      all = all.filter(p => !p.name.ru || p.name.ru === p.name.ro || !p.shortDescription.ru);
    }

    if (params.missingPrice) {
      all = all.filter(p => !p.price || !p.price.regularPrice || p.price.regularPrice <= 0);
    }

    if (params.missingStock) {
      all = all.filter(p => !p.inventory || p.inventory.every(inv => inv.physicalStock <= 0));
    }

    if (params.missingDocs) {
      all = all.filter(p => !p.documents || p.documents.length === 0);
    }

    if (params.demoOnly) {
      all = all.filter(p => p.status === 'demo' || p.dataValidationStatus === 'demo');
    }

    if (params.validatedOnly) {
      all = all.filter(p => p.dataValidationStatus === 'validated');
    }

    if (params.searchQuery) {
      const q = params.searchQuery.toLowerCase().trim();
      all = all.filter(p =>
        p.name.ro.toLowerCase().includes(q) ||
        p.name.ru.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.includes(q)) ||
        p.brandName.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    }

    return all;
  }

  async exportProductsJSON(): Promise<string> {
    const products = await this.getAllProducts();
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      source: 'CodeBau Catalog Pilot Admin',
      totalProducts: products.length,
      products
    };
    return JSON.stringify(exportData, null, 2);
  }

  async importProductsJSON(jsonContent: string, strategy: 'keep' | 'replace' | 'duplicate'): Promise<{ importedCount: number; errors: string[] }> {
    const errors: string[] = [];
    let importedCount = 0;

    try {
      const parsed = JSON.parse(jsonContent);
      const items: CatalogProduct[] = Array.isArray(parsed) ? parsed : (parsed.products || []);

      for (const item of items) {
        if (!item.id || !item.sku) {
          errors.push(`Produs invalid fără ID/SKU: ${item.name?.ro || 'fără nume'}`);
          continue;
        }

        const existing = await this.getProductById(item.id);
        if (existing) {
          if (strategy === 'keep') {
            continue;
          } else if (strategy === 'replace') {
            await this.updateProduct(item);
            importedCount++;
          } else if (strategy === 'duplicate') {
            const copyItem = {
              ...item,
              id: `prod-imported-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
              sku: `${item.sku}-IMP`,
              slug: `${item.slug}-imp`
            };
            await this.createProduct(copyItem);
            importedCount++;
          }
        } else {
          await this.createProduct(item);
          importedCount++;
        }
      }
    } catch (e: any) {
      errors.push(`Format JSON invalid: ${e.message}`);
    }

    return { importedCount, errors };
  }

  createFromTemplate(templateIndex: number): Promise<CatalogProduct> {
    const tpl = FIVE_PILOT_TEMPLATES[templateIndex] || FIVE_PILOT_TEMPLATES[0];
    return this.createProduct({
      ...tpl,
      name: {
        ro: `${tpl.name?.ro || 'Produs Nou'} (Pilot)`,
        ru: `${tpl.name?.ru || 'Новый товар'} (Пилот)`
      }
    });
  }
}

export const ProductRepository = new ProductRepositoryService();
