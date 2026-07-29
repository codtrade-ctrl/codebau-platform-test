import { Product, Article, ProjectSolution } from '../types';

export interface SearchResultGroup {
  products: Product[];
  categories: { name: string; count: number }[];
  projects: ProjectSolution[];
  articles: Article[];
  appliedSynonyms?: string[];
}

const SYNONYM_MAP: Record<string, string[]> = {
  glet: ['șpaclu', 'finisaj', 'tencuială', 'cerest', 'ct127'],
  spaclu: ['glet', 'finisaj'],
  adeziv: ['clei', 'ceresit', 'cm17', 'cm11', 'mapei'],
  clei: ['adeziv', 'ceresit', 'cm17'],
  faianta: ['gresie', 'ceramica', 'placi'],
  faianță: ['gresie', 'ceramică', 'plăci'],
  gresie: ['faianță', 'ceramică', 'plăci'],
  polistiren: ['penoplast', 'eps80', 'eps100', 'izolație', 'austrotherm'],
  penoplast: ['polistiren', 'eps80', 'izolație'],
  rigips: ['gips-carton', 'placă', 'profil'],
  gipscarton: ['gips-carton', 'rigips', 'placă'],
  'gips-carton': ['rigips', 'placă', 'profil'],
  autofiletanta: ['șurubelniță', 'sculă', 'acumulator'],
  autofiletantă: ['șurubelniță electrică', 'sculă'],
  vopsea: ['lavabilă', 'amorsă', 'colorant'],
  izolatie: ['polistiren', 'vată', 'hidroizolație'],
  izolație: ['polistiren', 'vată minerală', 'hidroizolație']
};

export function performIntelligentSearch(
  query: string,
  products: Product[],
  projects: ProjectSolution[] = [],
  articles: Article[] = []
): SearchResultGroup {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return { products: [], categories: [], projects: [], articles: [] };
  }

  // Check synonyms
  const synonymMatches = SYNONYM_MAP[normalizedQuery] || [];
  const searchTerms = [normalizedQuery, ...synonymMatches];

  // Match products
  const matchedProducts = products.filter(p => {
    const pTitle = p.name.toLowerCase();
    const pBrand = p.brand.toLowerCase();
    const pCategory = p.category.toLowerCase();
    const pSubcat = (p.subcategory || '').toLowerCase();
    const pSku = p.sku.toLowerCase();
    const pBarcode = (p.barcode || '').toLowerCase();

    return searchTerms.some(term => 
      pTitle.includes(term) ||
      pBrand.includes(term) ||
      pCategory.includes(term) ||
      pSubcat.includes(term) ||
      pSku.includes(term) ||
      pBarcode.includes(term)
    );
  });

  // Extract matched categories
  const categoryCounts: Record<string, number> = {};
  matchedProducts.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const categories = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

  // Match projects
  const matchedProjects = projects.filter(proj => {
    const title = proj.title.toLowerCase();
    const desc = proj.description.toLowerCase();
    return searchTerms.some(term => title.includes(term) || desc.includes(term));
  });

  // Match articles
  const matchedArticles = articles.filter(art => {
    const title = art.title.toLowerCase();
    const excerpt = art.excerpt.toLowerCase();
    return searchTerms.some(term => title.includes(term) || excerpt.includes(term));
  });

  return {
    products: matchedProducts,
    categories,
    projects: matchedProjects,
    articles: matchedArticles,
    appliedSynonyms: synonymMatches
  };
}
