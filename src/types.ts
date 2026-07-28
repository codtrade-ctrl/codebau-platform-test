export type UserRole = 'visitor' | 'retail' | 'meister' | 'b2b' | 'admin';

export type MeisterTier = 'Start' | 'Standard' | 'Pro' | 'Master' | 'Premium Partner';

export type BudgetTier = 'economic' | 'standard' | 'premium';

export interface ProductImageItem {
  url: string;
  alt: string;
  type: 'product' | 'application' | 'detail' | 'result' | 'packaging';
}

export interface BundleItemConfig {
  id: string;
  defaultQty: number;
  label?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  priceRetail: number; // MDL
  pricePro: number; // MDL for Meister Club
  unit: string; // ex: 'sac 25kg', 'm2', 'buc', 'rola 50m'
  image: string;
  images?: ProductImageItem[];
  rating: number;
  reviewCount: number;
  inStockCahul: number;
  inStockCantemir: number;
  inStockVulcanesti: number;
  inStockTaraclia: number;
  qualityTier: BudgetTier;
  consumptionPerSqM?: number; // e.g. 4.5 kg/m2
  consumptionUnit?: string;
  destination: 'interior' | 'exterior' | 'both';
  description: string;
  specs: Record<string, string>;
  complementaryIds?: string[]; // Legacy field
  complementaryProductIds?: string[]; // Explicit IDs for complementary products
  relatedProductIds?: string[]; // IDs for similar alternative products in same category
  bundleProductIds?: BundleItemConfig[]; // Config for recommended project bundle
  warrantyYears: number;
  barcode: string;
  slug?: string;
  technicalDataStatus?: 'mock' | 'verified' | 'official';
  qualityNote?: string; // e.g. "Mai accesibil", "Flexibilitate superioară C2TE S1"
  lockerEligible?: boolean;
  launchDate?: string; // YYYY-MM-DD
  newUntil?: string; // YYYY-MM-DD
  isManuallyMarkedNew?: boolean;
}

export interface MaterialCalcRequirement {
  productId: string;
  productName: string;
  unit: string;
  quantityNeeded: number;
  unitPrice: number;
  totalPrice: number;
  role: 'primary' | 'auxiliary' | 'tool';
  note?: string;
}

export interface ProjectSolution {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  estimatedDays: number;
  steps: { title: string; desc: string }[];
  defaultAreaSqM: number;
  economicEstimate: number;
  standardEstimate: number;
  premiumEstimate: number;
  defaultProducts: {
    economic: string[];
    standard: string[];
    premium: string[];
  };
}

export interface Craftsman {
  id: string;
  name: string;
  companyName?: string;
  avatar: string;
  specialties: string[];
  location: string;
  experienceYears: number;
  meisterLevel: MeisterTier;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  portfolioImages: string[];
  hourlyRate: number; // MDL/ora or per m2
  phone: string;
  email: string;
  bio: string;
  collaborationModels: ('simple' | 'verified' | 'codebau_managed')[];
  availableFrom: string;
}

export interface CodeBauStore {
  id: string;
  name: string;
  town: string;
  address: string;
  status: string;
  pickupAvailable: boolean;
  lockerAvailable: boolean;
  schedule: string;
  estimatedDelivery: string;
  stockKey: 'inStockCahul' | 'inStockCantemir' | 'inStockVulcanesti' | 'inStockTaraclia';
}

export interface CartItem {
  id?: string; // unique item id in cart
  productId?: string;
  sku?: string;
  slug?: string;
  name?: string;
  image?: string;
  brand?: string;
  quantity: number;
  unit?: string; // e.g. 'sac 25kg', 'm2', 'buc'
  packageSize?: string;
  unitPrice?: number;
  appliedPrice: number; // price applied based on user role (retail vs pro)
  priceListId?: string;
  selectedStoreId?: string;
  addedAt?: string;
  updatedAt?: string;
  isBundleItem?: boolean;
  bundleId?: string;
  bundleName?: string;
  bundleItems?: { productId: string; name: string; quantity: number; unitPrice: number; image: string }[];
  lockerEligible?: boolean;
  product: Product; // reference to full product
  testData?: boolean;
  basePrice?: number;
  promotionalPrice?: number;
  promotionId?: string;
  promotionName?: string;
  discountAmount?: number;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId: string;
  selectedStoreId: string;
  items: CartItem[];
  savedItems: CartItem[]; // "Salvate pentru mai târziu"
  currency: string; // 'MDL'
  createdAt: string;
  updatedAt: string;
  environment: 'development' | 'production';
  isTestData: boolean;
  appliedPromoCode?: string;
  promoDiscountMDL?: number;
  receivingMethod?: 'store_pickup' | 'delivery' | 'locker_247';
}

export type StockStatusType = 'available' | 'insufficient' | 'unavailable' | 'transferAvailable' | 'unknown';

export interface ItemStockValidation {
  productId: string;
  productName: string;
  requestedQty: number;
  availableQty: number;
  status: StockStatusType;
  otherStoreWithStock?: string;
  otherStoreQty?: number;
}

export interface CartStockValidationResult {
  isValid: boolean;
  hasInsufficient: boolean;
  hasUnavailable: boolean;
  itemResults: ItemStockValidation[];
}

export interface TestEvent {
  id: string;
  timestamp: string;
  type: 'cart_opened' | 'cart_item_added' | 'cart_item_removed' | 'cart_quantity_changed' | 'cart_store_changed' | 'cart_stock_validation_failed' | 'promo_code_applied' | 'checkout_started' | 'cart_cleared' | 'cart_saved_for_later' | 'cart_merged' | 'order_placed' | 'stock_reserved';
  payload: Record<string, any>;
}

export interface AppSettings {
  vatRate: number; // e.g. 0.20 (20%)
  environment: 'development' | 'production';
  newProductDurationDays?: number; // default 60
}

export type PromotionType = 
  | 'fixed_price'
  | 'percentage_discount'
  | 'amount_discount'
  | 'bundle_discount'
  | 'quantity_discount'
  | 'role_specific'
  | 'store_specific';

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: PromotionType;
  productIds?: string[];
  categoryIds?: string[];
  storeIds?: string[]; // e.g. ['cahul', 'cantemir'] or ['all']
  customerRoles?: string[]; // e.g. ['retail', 'guest', 'meister_pro', 'meister_master', 'b2b']
  priceListIds?: string[];
  discountPercentage?: number;
  discountAmount?: number;
  fixedPrice?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  active: boolean;
  priority: number;
  badgeText?: string;
  campaignImage?: string;
  terms?: string;
  maxQuantityPerCustomer?: number;
  fulfillmentMethods?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isTestData: boolean;
}

export interface EffectivePriceResult {
  basePrice: number;
  promotionalPrice: number;
  discountAmount: number;
  discountPercentage: number;
  promotionId?: string;
  promotionName?: string;
  validUntil?: string;
  badgeText?: string;
  terms?: string;
  maxQuantityPerCustomer?: number;
  appliedPriceList?: string;
  reason?: string;
  isPromoActive: boolean;
}

export interface PromotionAuditLog {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'activate' | 'deactivate' | 'delete' | 'price_change' | 'period_change' | 'expire';
  promotionId: string;
  promotionName?: string;
  before?: any;
  after?: any;
  timestamp: string;
  environment: string;
}

export type DeliveryMethod = 'standard' | 'express_site' | 'click_collect' | 'locker_247';

export interface SavedProject {
  id: string;
  title: string;
  clientName: string;
  location: string;
  budget: number;
  craftsmanName?: string;
  status: 'planning' | 'in_progress' | 'completed';
  items: CartItem[];
  notes: string;
  createdAt: string;
}

export interface DigitalWarranty {
  id: string;
  invoiceNumber: string;
  productName: string;
  purchaseDate: string;
  expiryDate: string;
  serialNumber: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface DigitalInvoice {
  id: string;
  number: string;
  date: string;
  totalAmount: number;
  downloadUrl: string;
  status: 'paid' | 'pending';
  clientType: string;
}

export type CustomerType = 'retail' | 'company' | 'visitor';

export interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isGuest?: boolean;
  companyName?: string;
  idno?: string;
  legalAddress?: string;
  contactPerson?: string;
  notes?: string;
  clientNumber?: string;
  internalOrderNumber?: string;
}

export interface DeliveryAddress {
  locality: string;
  street: string;
  number: string;
  building?: string;
  apartment?: string;
  postalCode?: string;
  district?: string;
  landmark?: string;
  recipientName: string;
  recipientPhone: string;
  driverNotes?: string;
  isManualLocality?: boolean;
}

export interface ExtraDeliveryServices {
  unloading?: boolean;
  handling?: boolean;
  floorDelivery?: boolean;
  callBeforeArrival?: boolean;
}

export interface FulfillmentDetails {
  pickupPersonName?: string;
  pickupPersonPhone?: string;
  pickupStoreAddress?: string;
  deliveryAddress?: DeliveryAddress;
  lockerId?: string;
  lockerLocation?: string;
  lockerPinCode?: string;
  lockerQrCode?: string;
  deliveryServiceType?: 'standard' | 'express_site' | 'scheduled' | 'on_site';
  extraServices?: ExtraDeliveryServices;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
  image?: string;
  priceListId?: string;
  bundleId?: string;
  selectedStoreId?: string;
  lockerEligible?: boolean;
  testData?: boolean;
  baseUnitPrice?: number;
  effectiveUnitPrice?: number;
  promotionId?: string;
  promotionName?: string;
  discountAmount?: number;
}

export type OrderStatus = 'submitted' | 'received' | 'confirmed' | 'requires_review' | 'preparing' | 'ready_for_pickup' | 'shipped' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';
export type PaymentStatus = 'not_required_test' | 'paid' | 'pay_on_delivery' | 'credit_line' | 'pending';
export type StockReservationStatus = 'pending' | 'reserved' | 'failed' | 'released';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestSessionId?: string;
  date: string;
  clientName: string;
  customerType: CustomerType;
  customerData: CustomerData;
  companyId?: string;
  projectId?: string;
  projectName?: string;
  storeId: string;
  storeLocation?: string;
  fulfillmentMethod: 'store_pickup' | 'delivery' | 'locker_247';
  fulfillmentDetails: FulfillmentDetails;
  deliveryMethod: DeliveryMethod;
  requestedDate: string;
  requestedTimeSlot: string;
  items: CartItem[];
  orderItems?: OrderItem[];
  subtotal: number;
  bundleDiscount: number;
  promotionalDiscount: number;
  deliveryCost: number | null; // null if 'de confirmat'
  deliveryCostStatus: 'calculated' | 'to_be_confirmed' | 'free' | 'unavailable';
  servicesCost: number;
  total: number; // total for products (+ delivery if calculated)
  currency: 'MDL';
  paymentMethod: 'pay_on_pickup' | 'pay_on_delivery' | 'bank_transfer_b2b' | 'online_disabled';
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  stockReservationStatus: StockReservationStatus;
  lockerCode?: string;
  notes?: string;
  isTestOrder: boolean;
  environment: 'test' | 'development' | 'production';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  termsConfirmed: boolean;
  trackingSteps?: { status: string; label: string; date?: string; completed: boolean }[];
  auditLogs?: { timestamp: string; action: string; performedBy: string; notes?: string }[];
}

export interface InventoryMovement {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  type: 'reservation' | 'release' | 'fulfillment';
  referenceType: 'order';
  referenceId: string;
  createdBy: string;
  createdAt: string;
  environment: string;
}

export interface SimulatedNotification {
  id: string;
  orderId: string;
  orderNumber: string;
  channel: 'sms' | 'email' | 'whatsapp';
  recipient: string;
  template: string;
  content: string;
  status: 'simulated_sent';
  createdAt: string;
}

export interface DeliveryQuote {
  status: 'calculated' | 'to_be_confirmed' | 'free' | 'unavailable';
  amountMDL: number | null;
  formattedText: string;
  estimatedTime: string;
  notes?: string;
}

export interface B2BCompanyProfile {
  companyName: string;
  cui: string;
  regCom: string;
  creditLimit: number;
  creditUsed: number;
  discountRate: number; // e.g. 12%
  assignedAccountManager: string;
  costCenters: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export type EditorialContentStatus = 'draft' | 'internal_review' | 'technically_verified' | 'published' | 'archived';
export type EditorialStatus = 'draft' | 'internal_review' | 'technical_review' | 'approved' | 'scheduled' | 'published' | 'archived';

export interface ArticleAuthor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  biography: string;
  verified: boolean;
  company?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    website?: string;
  };
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tags: string[];
  authorId: string;
  reviewerId?: string;
  heroImage: string;
  gallery?: string[];
  status: EditorialStatus;
  contentStatus: EditorialContentStatus;
  featured?: boolean;
  publishedAt: string;
  updatedAt: string;
  readingTime: string; // e.g. "5 min"
  relatedProductIds?: string[];
  relatedSolutionIds?: string[];
  relatedCalculatorId?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  language: 'ro' | 'ru';
  isTestData: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface EditorialAuditLog {
  id: string;
  articleId: string;
  articleTitle: string;
  userId: string;
  userRole: string;
  action: 'created' | 'edited' | 'author_changed' | 'reviewer_changed' | 'status_changed' | 'products_linked' | 'seo_updated' | 'published' | 'archived';
  details?: string;
  timestamp: string;
}

