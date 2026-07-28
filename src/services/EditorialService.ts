import { Article, ArticleAuthor, ArticleCategory, EditorialAuditLog } from '../types';
import { EDITORIAL_AUTHORS, EDITORIAL_CATEGORIES, INITIAL_ARTICLES, INITIAL_EDITORIAL_AUDIT_LOGS } from '../data/editorialData';

const STORAGE_KEY_ARTICLES = 'cb_articles_data_v1';
const STORAGE_KEY_AUDIT = 'cb_editorial_audit_logs_v1';

export class EditorialService {
  /**
   * Get all articles (from localStorage or defaults)
   */
  static getArticles(): Article[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ARTICLES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse articles from localStorage:', e);
    }
    // Default fallback
    this.saveArticles(INITIAL_ARTICLES);
    return INITIAL_ARTICLES;
  }

  /**
   * Save articles array to localStorage
   */
  private static saveArticles(articles: Article[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to save articles to localStorage:', e);
    }
  }

  /**
   * Get filtered articles based on status (published only for end-users, or all for admin)
   */
  static getPublishedArticles(categoryId: string = 'toate', searchQuery: string = '', tag?: string): Article[] {
    let articles = this.getArticles().filter(a => a.status === 'published' || a.contentStatus === 'published' || a.contentStatus === 'technically_verified');

    if (categoryId && categoryId !== 'toate') {
      articles = articles.filter(a => a.categoryId === categoryId);
    }

    if (tag) {
      articles = articles.filter(a => a.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return articles;
  }

  /**
   * Get featured article (Recomandarea Săptămânii)
   */
  static getFeaturedArticle(): Article | undefined {
    const articles = this.getPublishedArticles();
    return articles.find(a => a.featured) || articles[0];
  }

  /**
   * Get article by slug
   */
  static getArticleBySlug(slug: string): Article | undefined {
    const articles = this.getArticles();
    return articles.find(a => a.slug === slug || a.id === slug);
  }

  /**
   * Get article by ID
   */
  static getArticleById(id: string): Article | undefined {
    const articles = this.getArticles();
    return articles.find(a => a.id === id);
  }

  /**
   * Upsert / Save article
   */
  static saveArticle(article: Article, userId: string = 'admin_user', userRole: string = 'Administrator Editorial'): Article {
    const articles = this.getArticles();
    const existingIndex = articles.findIndex(a => a.id === article.id);

    const now = new Date().toISOString();
    let savedArticle: Article;

    if (existingIndex >= 0) {
      savedArticle = {
        ...articles[existingIndex],
        ...article,
        updatedAt: now.split('T')[0],
        updatedBy: userId
      };
      articles[existingIndex] = savedArticle;
      this.addAuditLog(savedArticle.id, savedArticle.title, userId, userRole, 'edited', `Articol actualizat (${savedArticle.status})`);
    } else {
      savedArticle = {
        ...article,
        createdAt: article.publishedAt || now.split('T')[0],
        updatedAt: now.split('T')[0],
        createdBy: userId,
        updatedBy: userId,
        isTestData: true
      };
      articles.unshift(savedArticle);
      this.addAuditLog(savedArticle.id, savedArticle.title, userId, userRole, 'created', `Articol creat ca ${savedArticle.status}`);
    }

    this.saveArticles(articles);
    return savedArticle;
  }

  /**
   * Update article status
   */
  static updateStatus(id: string, newStatus: Article['status'], userId: string = 'admin_user', userRole: string = 'Administrator Editorial'): void {
    const articles = this.getArticles();
    const article = articles.find(a => a.id === id);
    if (!article) return;

    article.status = newStatus;
    if (newStatus === 'published') {
      article.contentStatus = 'published';
      article.publishedAt = new Date().toISOString().split('T')[0];
    } else if (newStatus === 'archived') {
      article.contentStatus = 'archived';
    }
    article.updatedAt = new Date().toISOString().split('T')[0];
    article.updatedBy = userId;

    this.saveArticles(articles);
    this.addAuditLog(article.id, article.title, userId, userRole, 'status_changed', `Status schimbat în ${newStatus}`);
  }

  /**
   * Duplicate article
   */
  static duplicateArticle(id: string, userId: string = 'admin_user', userRole: string = 'Administrator Editorial'): Article | null {
    const article = this.getArticleById(id);
    if (!article) return null;

    const newSlug = `${article.slug}-copie-${Date.now().toString().slice(-4)}`;
    const duplicated: Article = {
      ...article,
      id: `art-${Date.now()}`,
      title: `${article.title} (Copie)`,
      slug: newSlug,
      status: 'draft',
      contentStatus: 'draft',
      publishedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: userId,
      updatedBy: userId
    };

    return this.saveArticle(duplicated, userId, userRole);
  }

  /**
   * Delete article
   */
  static deleteArticle(id: string, userId: string = 'admin_user', userRole: string = 'Administrator Editorial'): void {
    let articles = this.getArticles();
    const article = articles.find(a => a.id === id);
    if (article) {
      articles = articles.filter(a => a.id !== id);
      this.saveArticles(articles);
      this.addAuditLog(id, article.title, userId, userRole, 'archived', 'Articol șters');
    }
  }

  /**
   * Authors list
   */
  static getAuthors(): ArticleAuthor[] {
    return EDITORIAL_AUTHORS;
  }

  static getAuthorById(id: string): ArticleAuthor {
    return EDITORIAL_AUTHORS.find(a => a.id === id) || EDITORIAL_AUTHORS[0];
  }

  /**
   * Categories list
   */
  static getCategories(): ArticleCategory[] {
    return EDITORIAL_CATEGORIES;
  }

  /**
   * Audit logs
   */
  static getAuditLogs(): EditorialAuditLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load audit logs:', e);
    }
    return INITIAL_EDITORIAL_AUDIT_LOGS;
  }

  private static addAuditLog(articleId: string, articleTitle: string, userId: string, userRole: string, action: EditorialAuditLog['action'], details?: string): void {
    const logs = this.getAuditLogs();
    const newLog: EditorialAuditLog = {
      id: `audit-${Date.now()}`,
      articleId,
      articleTitle,
      userId,
      userRole,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.error('Failed to save audit log:', e);
    }
  }
}
