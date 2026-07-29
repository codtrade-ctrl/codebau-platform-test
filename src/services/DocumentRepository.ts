import { catalogDb } from './db';
import { ProductDocumentDetail, LocalizedText } from '../types/catalog';

export class DocumentRepositoryService {
  async uploadDocument(
    productId: string,
    file: File,
    type: ProductDocumentDetail['type'] = 'technical_sheet',
    title: LocalizedText = { ro: '', ru: '' },
    language: ProductDocumentDetail['language'] = 'ro'
  ): Promise<ProductDocumentDetail> {
    const id = `doc-${productId}-${Date.now()}-${Math.random().toString().slice(2, 6)}`;

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type || 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

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
      blobUrl
    };

    try {
      await catalogDb.put('documents', {
        id,
        productId,
        blob,
        fileName: file.name,
        mimeType: file.type || 'application/pdf'
      });
    } catch (e) {
      console.warn('Could not store document blob in IndexedDB:', e);
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
