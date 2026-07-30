import { catalogDb } from './db';
import { ProductDocumentDetail, LocalizedText } from '../types/catalog';

export class DocumentRepositoryService {
  async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  async uploadDocument(
    productId: string,
    file: File,
    type: ProductDocumentDetail['type'] = 'technical_sheet',
    title: LocalizedText = { ro: '', ru: '' },
    language: ProductDocumentDetail['language'] = 'ro'
  ): Promise<ProductDocumentDetail> {
    const id = `doc-${productId}-${Date.now()}-${Math.random().toString().slice(2, 6)}`;

    const dataUrl = await this.fileToDataUrl(file);

    const docDetail: ProductDocumentDetail = {
      id,
      productId,
      type,
      title: {
        ro: title.ro || file.name.replace(/\.[^/.]+$/, ''),
        ru: title.ru || file.name.replace(/\.[^/.]+$/, '')
      },
      language,
      fileName: file.name,
      mimeType: file.type || 'application/pdf',
      validated: true,
      fileSize: file.size,
      documentDate: new Date().toISOString().slice(0, 10),
      version: '1.0',
      blobUrl: dataUrl
    };

    try {
      await catalogDb.put('documents', {
        id,
        productId,
        dataUrl,
        fileName: file.name,
        mimeType: file.type || 'application/pdf'
      });
    } catch (e) {
      console.warn('Could not store document in IndexedDB:', e);
    }

    return docDetail;
  }

  async deleteDocument(documentId: string): Promise<void> {
    try {
      await catalogDb.delete('documents', documentId);
    } catch (e) {
      console.error(`Error deleting document ${documentId}:`, e);
    }
  }
}

export const DocumentRepository = new DocumentRepositoryService();
