import { catalogDb } from './db';
import { ProductImageDetail, LocalizedText } from '../types/catalog';

export class MediaRepositoryService {
  /**
   * Reads a file as a Base64 Data URL.
   */
  async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Resizes large images down (max 1200x1200px) and compresses to WebP/JPEG Data URL
   * to ensure minimal IndexedDB size and fast rendering.
   */
  async optimizeImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> {
    try {
      const rawDataUrl = await this.fileToDataUrl(file);

      // Only attempt canvas compression for image types
      if (!file.type.startsWith('image/')) {
        return rawDataUrl;
      }

      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const targetMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            const optimizedDataUrl = canvas.toDataURL(targetMime, quality);
            resolve(optimizedDataUrl);
            return;
          }
          resolve(rawDataUrl);
        };
        img.onerror = () => resolve(rawDataUrl);
        img.src = rawDataUrl;
      });
    } catch (e) {
      return this.fileToDataUrl(file);
    }
  }

  async uploadImage(
    productId: string,
    file: File,
    type: ProductImageDetail['type'] = 'main',
    alt: LocalizedText = { ro: '', ru: '' }
  ): Promise<ProductImageDetail> {
    const id = `img-${productId}-${Date.now()}-${Math.random().toString().slice(2, 6)}`;

    // Convert and compress file to persistent Data URL (Base64)
    const dataUrl = await this.optimizeImage(file);

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
      url: dataUrl
    };

    // Store in media IndexedDB store for secondary backup
    try {
      await catalogDb.put('media', {
        id,
        productId,
        dataUrl,
        fileName: file.name,
        mimeType: file.type,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Could not store media in IndexedDB store:', e);
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

