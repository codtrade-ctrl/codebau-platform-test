import React, { useState } from 'react';
import { Product, UserRole } from '../types';
import { ShoppingCart, Star, Shield, Eye, Heart, Check, Sparkles, Tag } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { PromotionService } from '../services/PromotionService';

interface ProductCardProps {
  product: Product;
  currentRole?: UserRole;
  userRole?: UserRole;
  selectedStore?: string;
  onAddToCart: (p: Product) => void;
  onOpenDetail?: (p: Product) => void;
  onSelectProduct?: (p: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentRole,
  userRole,
  selectedStore = 'CodeBau Cahul',
  onAddToCart,
  onOpenDetail,
  onSelectProduct,
  isFavorite = false,
  onToggleFavorite
}) => {
  const role = currentRole || userRole || 'client';
  const handleOpen = onOpenDetail || onSelectProduct || (() => {});
  const handleFav = onToggleFavorite || (() => {});
  const [justAdded, setJustAdded] = useState(false);

  // Determine stock safely based on selected store
  const storeName = selectedStore || 'CodeBau Cahul';
  let stock = product.inStockCahul ?? 0;
  let storeDisplayName = 'CodeBau Cahul';

  if (storeName.includes('Cantemir')) {
    stock = product.inStockCantemir ?? 0;
    storeDisplayName = 'CodeBau Cantemir';
  } else if (storeName.includes('Vulcănești') || storeName.includes('Vulcanesti')) {
    stock = product.inStockVulcanesti ?? 0;
    storeDisplayName = 'CodeBau Vulcănești';
  } else if (storeName.includes('Taraclia')) {
    stock = product.inStockTaraclia ?? 0;
    storeDisplayName = 'CodeBau Taraclia';
  } else {
    stock = product.inStockCahul ?? 0;
    storeDisplayName = 'CodeBau Cahul';
  }

  const showProPrice = role === 'meister' || role === 'b2b';
  const basePrice = showProPrice ? product.pricePro : product.priceRetail;

  // Calculate promotional effective price & new status
  const effectivePrice = PromotionService.calculateEffectivePrice({
    product,
    basePrice,
    userRole: role,
    selectedStore,
    quantity: 1
  });

  const isNew = PromotionService.isNewProduct(product);
  const otherRolePromo = !effectivePrice.isPromoActive ? PromotionService.hasOtherRolePromo(product, role) : null;

  const formatPrice = (val: number) => {
    return val.toLocaleString('ro-MD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\./g, ',');
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="bg-white border border-[#D9E2E1] rounded-2xl overflow-hidden hover:border-[#00A878] transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md h-full relative">
      
      {/* Product Image & Commercial Badges */}
      <div className="relative aspect-[16/10] bg-[#F8FAF9] overflow-hidden cursor-pointer shrink-0" onClick={() => handleOpen(product)}>
        <ProductImage 
          src={product.image} 
          alt={product.name}
          category={product.subcategory || product.category}
          aspectRatio="aspect-full h-full w-full"
          className="group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
        />

        {/* Commercial Badges Hierarchy (1. Promo, 2. Noutate, 3. Quality/Brand) */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10">
          <div className="flex flex-wrap items-center gap-1 max-w-[85%]">
            {/* 1. Promo Badge (Amber) */}
            {effectivePrice.isPromoActive && (
              <span className="bg-[#F4B400] text-[#0D1B2A] text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-amber-600/30 shadow-xs flex items-center gap-1 shrink-0">
                <Tag className="w-3 h-3 fill-current" />
                {effectivePrice.badgeText || 'PROMOȚIE'}
              </span>
            )}

            {/* 2. Noutate Badge (Soft Teal) */}
            {isNew && (
              <span className="bg-[#DDF5EE] text-[#087F5B] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-[#087F5B]/20 shadow-xs flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 stroke-[2.5]" />
                NOUTATE
              </span>
            )}
          </div>

          {/* Secondary Quality Tier / Brand Badge */}
          <div className="flex items-center gap-1">
            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
              product.qualityTier === 'premium' ? 'bg-[#087F5B] text-white' :
              product.qualityTier === 'standard' ? 'bg-[#E9ECEF] text-[#0D1B2A]' : 'bg-[#F1F3F5] text-[#5C6670]'
            }`}>
              {product.qualityTier}
            </span>
            <span className="bg-white/90 text-[#0D1B2A] text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-[#D9E2E1] backdrop-blur-sm shadow-xs">
              {product.brand}
            </span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFav(product);
          }}
          aria-label={`Adaugă ${product.name} la favorite`}
          className={`absolute top-2 right-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full backdrop-blur-md transition-colors z-10 ${
            isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 text-[#5C6670] hover:text-[#0D1B2A] hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-[#0D1B2A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-[#0D1B2A] text-xs font-extrabold px-3 py-1.5 rounded-xl border border-[#D9E2E1] flex items-center gap-1.5 shadow-md">
            <Eye className="w-4 h-4 text-[#087F5B]" />
            Vezi detalii
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        
        {/* Title & SKU & Rating */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-[#5C6670] font-mono tracking-wide font-medium">SKU: {product.sku}</p>
          <h4 
            onClick={() => handleOpen(product)}
            className="text-sm font-extrabold text-[#0D1B2A] line-clamp-2 min-h-[2.5rem] hover:text-[#087F5B] cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h4>

          {/* Rating & Warranty */}
          <div className="flex items-center gap-3 text-xs pt-1">
            <div className="flex items-center text-[#087F5B] font-extrabold">
              <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-[#5C6670] text-[10px] ml-1">({product.reviewCount})</span>
            </div>
            <div className="flex items-center text-[#5C6670] text-[11px] font-medium">
              <Shield className="w-3 h-3 text-[#00A878] mr-1 shrink-0" />
              <span>{product.warrantyYears && product.warrantyYears > 0 ? `Garanție ${product.warrantyYears} Ani` : 'Documentație tehnică'}</span>
            </div>
          </div>
        </div>

        {/* Unified Store Stock Status Block */}
        <div className="bg-[#EFFAF6] p-2.5 rounded-xl border border-[#00A878]/30 text-[11px]">
          {stock > 0 ? (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between font-extrabold">
                <span className="flex items-center gap-1.5 text-[#0D1B2A]">
                  <span className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse"></span>
                  În stoc la {storeDisplayName}
                </span>
                <span className="text-[#087F5B] font-black">{stock} {product.unit}</span>
              </div>
              <p className="text-[10px] text-[#5C6670] font-medium pl-3.5">Ridicare disponibilă astăzi</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between font-extrabold">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  La comandă din {storeDisplayName}
                </span>
              </div>
              <p className="text-[10px] text-[#5C6670] font-medium pl-3.5">Livrare în 1–2 zile</p>
            </div>
          )}
        </div>

        {/* Pricing Block with Promotional Support */}
        <div className="pt-2 border-t border-[#D9E2E1] flex items-center justify-between gap-2 mt-auto">
          <div className="flex-1 min-w-0">
            {effectivePrice.isPromoActive ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-[#5C6670] line-through font-bold">
                    {formatPrice(effectivePrice.basePrice)} MDL
                  </span>
                  <span className="text-[10px] bg-[#DDF5EE] text-[#087F5B] font-extrabold px-1.5 py-0.2 rounded">
                    −{effectivePrice.discountPercentage}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-xl font-black text-[#0D1B2A] whitespace-nowrap">
                    {formatPrice(effectivePrice.promotionalPrice)} MDL
                  </span>
                  <span className="text-xs text-[#5C6670] font-medium">/ {product.unit}</span>
                </div>
                <p className="text-[10px] text-[#087F5B] font-extrabold">
                  Economisești {formatPrice(effectivePrice.discountAmount)} MDL
                </p>
              </div>
            ) : showProPrice ? (
              <div>
                <p className="text-[10px] text-[#087F5B] font-extrabold uppercase tracking-wider">Preț Meister / B2B</p>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-lg font-black text-[#087F5B] whitespace-nowrap">{formatPrice(product.pricePro)} MDL</span>
                  <span className="text-xs text-[#5C6670] font-medium">/ {product.unit}</span>
                </div>
                <p className="text-[10px] text-[#5C6670] line-through">Retail: {formatPrice(product.priceRetail)} MDL</p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] text-[#5C6670] uppercase tracking-wider font-extrabold">Preț Persoană Fizică</p>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-xl font-black text-[#0D1B2A] whitespace-nowrap">{formatPrice(product.priceRetail)} MDL</span>
                  <span className="text-xs text-[#5C6670] font-medium">/ {product.unit}</span>
                </div>
                {otherRolePromo && (
                  <p className="text-[9px] text-amber-700 font-extrabold mt-0.5">
                    Autentifică-te pentru oferta meșteri / B2B
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCartClick}
            aria-label={`Adaugă ${product.name} în coș`}
            className={`min-h-[44px] px-3.5 rounded-xl font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              justAdded 
                ? 'bg-[#00A878] text-white scale-105' 
                : 'bg-[#087F5B] hover:bg-[#066B4D] active:scale-95 text-white'
            }`}
            title="Adaugă în coș"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Adăugat!</span>
                <span className="sm:hidden">Adăugat</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Adaugă</span>
                <span className="sm:hidden">Adaugă în coș</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

