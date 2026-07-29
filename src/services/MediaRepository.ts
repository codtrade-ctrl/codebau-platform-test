import { catalogDb } from './db';
import { ProductImageDetail, LocalizedText } from '../types/catalog';

export class MediaRepositoryService {
  async uploadImage(
    productId: string,
    file: File,
    type: ProductImageDetail['type'] = 'main',
    alt: LocalizedText = { ro: '', ru: '' }
  ): Promise<ProductImageDetail> {
    const id = `img-${productId}-${Date.now()}-${Math.random().toString().slice(2, 6)}`;

    // Convert file to ArrayBuffer for IndexedDB storage
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    const url = URL.createObjectURL(blob);

    const imageDetail: ProductImageDetail = {
      id,
      productId,
      type,
      fileName: file.name,
      mimeType: file.type,
      sortOrder: type === 'main' ? 1 : 10,
      alt: {
        ro: alt.ro || file.name.replace(/\.[^/.]+$/, ''),
        ru: alt.ru || file.name.replace(/\.[^/.]+$/, '')
      },
      url
    };

    // Store binary payload in media store
    try {
      await catalogDb.put('media', {
        id,
        productId,
        blob,
        fileName: file.name,
        mimeType: file.type
      });
    } catch (e) {
      console.warn('Could not store media blob in IndexedDB, using object URL:', e);
    }

    return imageDetail;
  }

  async deleteImage(imageId: string): Promise<void> {
    try {
      await catalogDb.delete('media', imageId);
    } catch (e) {
      console.error(`Error deleting image media ${imageId}:`, e);
    }
  }
}

export const MediaRepository = new MediaRepositoryService();
