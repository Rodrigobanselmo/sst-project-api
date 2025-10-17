import { AiContentItem } from '../ai.interface';

/**
 * Helper functions to build content items for the AI adapter
 */
export class AiContentBuilders {
  /**
   * Create a text content item
   */
  static text(text: string, options?: { cacheable?: boolean }): AiContentItem {
    const item: AiContentItem = {
      type: 'text',
      text,
    };

    if (options?.cacheable) {
      item.cache_control = { type: 'ephemeral' };
    }

    return item;
  }

  /**
   * Create an image content item
   */
  static image(url: string, detail: 'low' | 'high' | 'auto' = 'high'): AiContentItem {
    return {
      type: 'image_url',
      image_url: {
        url,
        detail,
      },
    };
  }

  /**
   * Create multiple image content items from URLs
   */
  static images(urls: string[], detail: 'low' | 'high' | 'auto' = 'high'): AiContentItem[] {
    return urls.map((url) => this.image(url, detail));
  }

  /**
   * Create mixed content with text and images
   */
  static mixed(items: Array<{ type: 'text'; text: string } | { type: 'image'; url: string; detail?: 'low' | 'high' | 'auto' }>): AiContentItem[] {
    return items.map((item) => {
      if (item.type === 'text') {
        return this.text(item.text);
      } else {
        return this.image(item.url, item.detail);
      }
    });
  }

  /**
   * Helper for characterization analysis (text only)
   */
  static forCharacterization(content: string): AiContentItem[] {
    return [this.text(content)];
  }

  /**
   * Helper for image analysis
   */
  static forImageAnalysis(imageUrls: string[], detail: 'low' | 'high' | 'auto' = 'high'): AiContentItem[] {
    return this.images(imageUrls, detail);
  }

  /**
   * Helper for mixed analysis (text + images)
   */
  static forMixedAnalysis(text: string, imageUrls: string[], detail: 'low' | 'high' | 'auto' = 'high'): AiContentItem[] {
    return [this.text(text), ...this.images(imageUrls, detail)];
  }
}
