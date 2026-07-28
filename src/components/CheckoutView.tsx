import React, { useState, useEffect } from 'react';
import { 
  UserRole, Product, CartItem, Order, CustomerType, CustomerData, DeliveryAddress, 
  FulfillmentDetails, ExtraDeliveryServices, DeliveryQuote, CodeBauStore, SavedProject
} from '../types';
import { MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { formatMoney, validateCartStock, appSettings } from '../utils/formatters';
import { DeliveryQuoteService } from '../services/DeliveryQuoteService';
import { OrderRepository } from '../services/orderRepository';
import { logTestEvent } from '../services/cartRepository';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, Store, Truck, 
  QrCode, Calendar, Clock, MapPin, User, Building2, FileText, Lock, RefreshCw, 
  Check, Info, ChevronDown, ChevronUp, AlertCircle, Sparkles, CreditCard, HelpCircle
} from 'lucide-react';

interface CheckoutViewProps {
  cartItems: CartItem[];
  selectedStore: string;
  onStoreChange: (storeName: string) => void;
  currentRole: UserRole;
  onClearCart: () => void;
  onNavigateToCart: () => void;
  onNavigateToConfirmation: (orderNumber: string) => void;
  onNavigateToCatalog: () => void;
  savedProjects?: SavedProject[];
  onAddProject?: (project: SavedProject) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  selectedStore,
  onStoreChange,
  currentRole,
  onClearCart,
  onNavigateToCart,
  onNavigateToConfirmation,
  onNavigateToCatalog,
  savedProjects = [],
  onAddProject
}) => {
  // Current Active Step (1: Client, 2: Primire, 3: Verificare)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});

  // 1. CLIENT DATA STATE
  const [customerType, setCustomerType] = useState<CustomerType>(
    currentRole === 'b2b' ? 'company' : currentRole === 'meister' ? 'retail' : 'visitor'
  );

  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: currentRole === 'b2b' ? 'Adrian' : currentRole === 'meister' ? 'Ion' : '',
    lastName: currentRole === 'b2b' ? 'Ceban' : currentRole === 'meister' ? 'Munteanu' : '',
    phone: '+373 69 123 456',
    email: currentRole === 'b2b' ? 'achizitii@constructia.md' : currentRole === 'meister' ? 'ion.meister@codebau.test' : '',
    isGuest: currentRole === 'visitor',
    companyName: currentRole === 'b2b' ? 'Construcția Sud SRL' : '',
    idno: currentRole === 'b2b' ? '1003600012345' : '',
    legalAddress: currentRole === 'b2b' ? 'mun. Cahul, str. Independenței 45' : '',
    contactPerson: currentRole === 'b2b' ? 'Adrian Ceban' : '',
    clientNumber: currentRole === 'meister' ? 'MEISTER-CH-882' : '',
    internalOrderNumber: '',
    notes: ''
  });

  // Project Association (for Meister & B2B)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('none');
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectLocality, setNewProjectLocality] = useState('mun. Cahul');
  const [newProjectAddress, setNewProjectAddress] = useState('');

  // 2. FULFILLMENT & LOGISTICS STATE
  const [receivingMethod, setReceivingMethod] = useState<'store_pickup' | 'delivery' | 'locker_247'>('store_pickup');

  // Pickup details
  const [pickupPersonName, setPickupPersonName] = useState(`${customerData.firstName} ${customerData.lastName}`.trim() || 'Client CodeBau');
  const [pickupPersonPhone, setPickupPersonPhone] = useState(customerData.phone || '+373');

  // Delivery details
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    locality: 'mun. Cahul',
    street: 'str. Ștefan cel Mare',
    number: '14',
    building: '',
    apartment: '',
    postalCode: 'MD-3900',
    district: 'raionul Cahul',
    landmark: 'Lângă magazinul local',
    recipientName: `${customerData.firstName} ${customerData.lastName}`.trim() || 'Client CodeBau',
    recipientPhone: customerData.phone || '+373 69 123 456',
    driverNotes: 'Acces pentru camion mare cu macara.',
    isManualLocality: false
  });

  const [deliveryServiceType, setDeliveryServiceType] = useState<'standard' | 'express_site' | 'scheduled' | 'on_site'>('standard');
  const [extraServices, setExtraServices] = useState<ExtraDeliveryServices>({
    unloading: true,
    handling: false,
    floorDelivery: false,
    callBeforeArrival: true
  });

  // Date and Time slot
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [requestedDate, setRequestedDate] = useState<string>(tomorrowStr);
  const [requestedTimeSlot, setRequestedTimeSlot] = useState<string>('09:00 - 12:00');

  // Saved address preference
  const [saveAddressToAccount, setSaveAddressToAccount] = useState<boolean>(false);

  // 3. PAYMENT METHOD & TERMS
  const [paymentMethod, setPaymentMethod] = useState<'pay_on_pickup' | 'pay_on_delivery' | 'bank_transfer_b2b' | 'online_disabled'>(
    currentRole === 'b2b' ? 'bank_transfer_b2b' : 'pay_on_pickup'
  );
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);
  const [marketingAccepted, setMarketingAccepted] = useState<boolean>(false);

  // Re-validation and Submitting state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationAlert, setValidationAlert] = useState<string | null>(null);
  const [mobileSummaryExpanded, setMobileSummaryExpanded] = useState<boolean>(false);

  // Pre-load checkout draft if exists
  useEffect(() => {
    const draft = OrderRepository.getCheckoutDraft();
    if (draft) {
      if (draft.customerType) setCustomerType(draft.customerType);
      if (draft.customerData) setCustomerData(prev => ({ ...prev, ...draft.customerData }));
      if (draft.receivingMethod) setReceivingMethod(draft.receivingMethod);
      if (draft.deliveryAddress) setDeliveryAddress(prev => ({ ...prev, ...draft.deliveryAddress }));
    }
  }, []);

  // Save progress draft whenever key fields change
  useEffect(() => {
    OrderRepository.saveCheckoutDraft({
      currentStep,
      customerType,
      customerData,
      receivingMethod,
      deliveryAddress
    });
  }, [currentStep, customerType, customerData, receivingMethod, deliveryAddress]);

  // Selected Store Info
  const activeStoreObj = MOCK_STORES.find(s => s.name === selectedStore) || MOCK_STORES[0];

  // Stock Validation
  const stockValidation = validateCartStock(cartItems, selectedStore);

  // Locker Eligibility
  const ineligibleLockerItems = cartItems.filter(i => i.product.lockerEligible === false);
  const isLockerEligible = ineligibleLockerItems.length === 0;

  // Delivery Quote Calculation
  const deliveryQuote: DeliveryQuote = DeliveryQuoteService.calculateQuote({
    storeId: activeStoreObj.id,
    locality: deliveryAddress.locality,
    isManualLocality: deliveryAddress.isManualLocality,
    fulfillmentMethod: receivingMethod,
    deliveryServiceType,
    extraServices,
    items: cartItems
  });

  // Calculate Subtotal & Totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.appliedPrice * item.quantity), 0);
  const bundleDiscount = 0;
  const promoDiscount = 0;
  const deliveryCostMDL = deliveryQuote.amountMDL;
  const servicesCost = (extraServices.handling ? 50 : 0) + (extraServices.floorDelivery ? 60 : 0);

  // If delivery cost is "de confirmat", total is products + services (delivery excluded until confirmed)
  const estimatedTotal = subtotal + (deliveryCostMDL || 0) + servicesCost;
  const vatAmount = estimatedTotal * appSettings.vatRate / (1 + appSettings.vatRate);

  // Handle Store Change with confirmation
  const handleStoreChangeRequest = (newStoreName: string) => {
    const newVal = validateCartStock(cartItems, newStoreName);
    if (!newVal.isValid) {
      if (!window.confirm(`La magazinul ${newStoreName}, anumite produse au stoc limitat. Dorești să schimbi magazinul?`)) {
        return;
      }
    }
    onStoreChange(newStoreName);
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errors: string[] = [];
    if (!customerData.firstName || customerData.firstName.trim().length < 2) {
      errors.push('Prenumele trebuie să conțină cel puțin 2 caractere.');
    }
    if (!customerData.lastName || customerData.lastName.trim().length < 2) {
      errors.push('Numele trebuie să conțină cel puțin 2 caractere.');
    }
    if (!customerData.phone || customerData.phone.trim().length < 8) {
      errors.push('Introduceți un număr de telefon valid (+373).');
    }
    if (!customerData.email || !customerData.email.includes('@')) {
      errors.push('Introduceți o adresă de e-mail validă.');
    }

    if (customerType === 'company') {
      if (!customerData.companyName || customerData.companyName.trim().length < 2) {
        errors.push('Introduceți denumirea companiei.');
      }
      if (!customerData.idno || customerData.idno.trim().length < 8) {
        errors.push('Introduceți un IDNO / Cod fiscal valid.');
      }
      if (!customerData.legalAddress) {
        errors.push('Introduceți adresa juridică a companiei.');
      }
    }

    if (errors.length > 0) {
      setStepErrors({ ...stepErrors, 1: errors.join(' ') });
      return false;
    }

    setStepErrors({ ...stepErrors, 1: '' });
    return true;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errors: string[] = [];

    if (receivingMethod === 'locker_247' && !isLockerEligible) {
      errors.push('Comanda conține produse voluminoase neeligibile pentru Locker 24/7. Vă rugăm să alegeți Ridicare din magazin sau Livrare.');
    }

    if (receivingMethod === 'delivery') {
      if (!deliveryAddress.locality) {
        errors.push('Selectați sau introduceți localitatea de livrare.');
      }
      if (!deliveryAddress.street || !deliveryAddress.number) {
        errors.push('Introduceți strada și numărul pentru livrare.');
      }
      if (!deliveryAddress.recipientPhone) {
        errors.push('Introduceți numărul de telefon al destinatarului.');
      }
    }

    if (!requestedDate) {
      errors.push('Selectați data dorită.');
    }

    if (errors.length > 0) {
      setStepErrors({ ...stepErrors, 2: errors.join(' ') });
      return false;
    }

    setStepErrors({ ...stepErrors, 2: '' });
    return true;
  };

  // Go to Next Step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create & Submit Test Order
  const handleFinalizeTestOrder = () => {
    if (!termsConfirmed) {
      setValidationAlert('Trebuie să confirmați că datele comenzii de test sunt corecte înainte de plasare.');
      return;
    }

    // Re-validate entire checkout
    if (!validateStep1() || !validateStep2()) {
      setValidationAlert('Vă rugăm să corectați erorile din pașii anteriori.');
      return;
    }

    setIsSubmitting(true);
    setValidationAlert(null);

    // Re-check prices and stock live
    const freshStockVal = validateCartStock(cartItems, selectedStore);

    const generatedOrderNumber = OrderRepository.generateOrderNumber();
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber: generatedOrderNumber,
      userId: currentRole !== 'visitor' ? `usr_${currentRole}` : undefined,
      guestSessionId: currentRole === 'visitor' ? 'guest_session_123' : undefined,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      clientName: customerType === 'company' ? (customerData.companyName || 'Companie Test') : `${customerData.firstName} ${customerData.lastName}`,
      customerType,
      customerData,
      companyId: customerType === 'company' ? `comp_${Date.now()}` : undefined,
      projectId: selectedProjectId !== 'none' ? selectedProjectId : undefined,
      projectName: selectedProjectId !== 'none' ? (savedProjects.find(p => p.id === selectedProjectId)?.title || 'Proiect Șantier') : undefined,
      storeId: activeStoreObj.id,
      storeLocation: activeStoreObj.name,
      fulfillmentMethod: receivingMethod,
      fulfillmentDetails: {
        pickupPersonName,
        pickupPersonPhone,
        pickupStoreAddress: activeStoreObj.address,
        deliveryAddress: receivingMethod === 'delivery' ? deliveryAddress : undefined,
        lockerId: receivingMethod === 'locker_247' ? `LOCKER-${activeStoreObj.id.toUpperCase()}` : undefined,
        lockerLocation: receivingMethod === 'locker_247' ? `${activeStoreObj.name} - Locker 24/7 Exterior` : undefined,
        deliveryServiceType,
        extraServices
      },
      deliveryMethod: receivingMethod === 'delivery' ? 'express_site' : receivingMethod === 'locker_247' ? 'locker_247' : 'click_collect',
      requestedDate,
      requestedTimeSlot,
      items: [...cartItems],
      orderItems: cartItems.map(item => ({
        productId: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        quantity: item.quantity,
        unit: item.product.unit,
        unitPrice: item.appliedPrice,
        lineTotal: item.appliedPrice * item.quantity,
        image: item.product.image,
        selectedStoreId: activeStoreObj.id,
        lockerEligible: item.product.lockerEligible,
        testData: true
      })),
      subtotal,
      bundleDiscount,
      promotionalDiscount: promoDiscount,
      deliveryCost: deliveryQuote.amountMDL,
      deliveryCostStatus: deliveryQuote.status,
      servicesCost,
      total: estimatedTotal,
      currency: 'MDL',
      paymentMethod,
      paymentStatus: 'not_required_test',
      status: 'submitted',
      stockReservationStatus: 'pending',
      notes: customerData.notes,
      isTestOrder: true,
      environment: 'test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: `${customerData.firstName} ${customerData.lastName} (${customerType})`,
      termsConfirmed: true,
      trackingSteps: [
        { status: 'submitted', label: 'Comandă de test înregistrată', date: 'Acum', completed: true },
        { status: 'confirmed', label: 'Verificare & Rezervare Stoc', date: 'În procesare', completed: true },
        { status: 'preparing', label: 'Pregătire în depozitul CodeBau', completed: false },
        { status: 'ready_for_pickup', label: 'Preluare / Livrare șantier', completed: false }
      ]
    };

    setTimeout(() => {
      // Place Order and perform Atomic Stock Reservation
      const createdOrder = OrderRepository.placeTestOrder(newOrder, MOCK_PRODUCTS);

      // Clear Cart & Draft
      onClearCart();
      OrderRepository.clearCheckoutDraft();

      setIsSubmitting(false);

      // Navigate to Confirmation
      onNavigateToConfirmation(createdOrder.orderNumber);
    }, 800);
  };

  // Empty cart fallback
  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F4F7F6] min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#D9E2E1] rounded-3xl p-8 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#EFFAF6] border border-[#00A878]/30 flex items-center justify-center text-[#087F5B] mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#0D1B2A]">Coșul tău este gol</h2>
          <p className="text-xs text-[#5C6670]">
            Nu ai produse adăugate în coș pentru a continua spre procesul de finalizare a comenzii.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-3.5 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Înapoiește-te la Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7F6] min-h-screen pb-24 lg:pb-12 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP TEST ENVIRONMENT BANNER (REQ #3) */}
        <div id="checkout-test-environment-banner" className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-2xl p-4 text-xs text-[#92400E] flex items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center shrink-0 text-[#B45309]">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-[#78350F]">Mediu de test CodeBau</p>
              <p className="text-[11px] text-[#92400E] font-medium">
                Această comandă nu produce efecte comerciale, fiscale sau logistice reale. Toate comenzile create sunt marcat ca comenzi de test.
              </p>
            </div>
          </div>
          <span className="hidden md:inline-block bg-[#F59E0B]/20 text-[#78350F] text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0 border border-[#F59E0B]/30">
            TEST MODE ACTIVE
          </span>
        </div>

        {/* HEADER & STEPPER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E2E1] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToCart}
              className="p-2 rounded-xl bg-white border border-[#D9E2E1] text-[#0D1B2A] hover:bg-[#EFFAF6] transition-colors cursor-pointer shrink-0"
              title="Înapoi la coș"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0D1B2A] tracking-tight">Finalizarea comenzii</h1>
              <p className="text-xs text-[#5C6670] font-medium">Verificare, primire și înregistrare comandă de test</p>
            </div>
          </div>

          {/* Stepper (Req #2) */}
          <div className="flex items-center gap-2 sm:gap-4 bg-white border border-[#D9E2E1] rounded-2xl p-2 shadow-xs overflow-x-auto">
            {[
              { num: 1, label: 'Client' },
              { num: 2, label: 'Primire' },
              { num: 3, label: 'Verificare' }
            ].map((s) => {
              const isCompleted = currentStep > s.num;
              const isActive = currentStep === s.num;
              const hasError = !!stepErrors[s.num];

              return (
                <button
                  key={s.num}
                  onClick={() => {
                    if (s.num < currentStep) setCurrentStep(s.num);
                  }}
                  disabled={s.num > currentStep}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                    isCompleted
                      ? 'bg-[#DDF5EE] text-[#087F5B] cursor-pointer'
                      : isActive
                      ? 'bg-[#087F5B] text-white shadow-xs'
                      : 'bg-[#F8FAF9] text-[#5C6670] cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                    isCompleted ? 'bg-[#087F5B] text-white' : isActive ? 'bg-white text-[#087F5B]' : 'bg-[#D9E2E1] text-[#5C6670]'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Alert */}
        {validationAlert && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{validationAlert}</span>
          </div>
        )}

        {/* MAIN LAYOUT: LEFT FORM, RIGHT SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT FORM COLUMN (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* STEP 1: CLIENT DATA */}
            {currentStep === 1 && (
              <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
                
                <div className="border-b border-[#D9E2E1] pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-[#0D1B2A] flex items-center gap-2">
                      <User className="w-5 h-5 text-[#087F5B]" />
                      <span>1. Date client și tip cumpărător</span>
                    </h2>
                    <p className="text-xs text-[#5C6670] mt-0.5">Selectează modul în care dorești să înregistrezi comanda de test.</p>
                  </div>
                  {currentRole !== 'visitor' && (
                    <span className="bg-[#DDF5EE] text-[#087F5B] text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-[#00A878]/30">
                      Autentificat ca {currentRole.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Client Type Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-[#0D1B2A]">Cumpăr ca:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerType('retail');
                        setCustomerData(p => ({ ...p, isGuest: false }));
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 cursor-pointer ${
                        customerType === 'retail'
                          ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] shadow-xs'
                          : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                      }`}
                    >
                      <User className="w-5 h-5 text-[#087F5B]" />
                      <h4 className="font-extrabold text-xs text-[#0D1B2A]">Persoană fizică</h4>
                      <p className="text-[11px] text-[#5C6670] font-medium">Persoană fizică sau meșter individual</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCustomerType('company');
                        setCustomerData(p => ({ ...p, isGuest: false }));
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 cursor-pointer ${
                        customerType === 'company'
                          ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] shadow-xs'
                          : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-[#087F5B]" />
                      <h4 className="font-extrabold text-xs text-[#0D1B2A]">Companie / B2B</h4>
                      <p className="text-[11px] text-[#5C6670] font-medium">Factură fiscală B2B, IDNO și condiții pro</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCustomerType('visitor');
                        setCustomerData(p => ({ ...p, isGuest: true }));
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 cursor-pointer ${
                        customerType === 'visitor'
                          ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] shadow-xs'
                          : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 text-[#087F5B]" />
                      <h4 className="font-extrabold text-xs text-[#0D1B2A]">Vizitator rapid</h4>
                      <p className="text-[11px] text-[#5C6670] font-medium">Fără crearea unui cont permanent</p>
                    </button>
                  </div>
                </div>

                {/* PROJECT ASSOCIATION (for Meister & B2B) */}
                {(currentRole === 'meister' || currentRole === 'b2b' || customerType === 'company') && (
                  <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-[#0D1B2A] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#087F5B]" />
                        <span>Asociază comanda unui proiect sau șantier</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNewProjectModal(true)}
                        className="text-[11px] font-extrabold text-[#087F5B] hover:underline cursor-pointer"
                      >
                        + Creează proiect nou
                      </button>
                    </div>

                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full bg-white text-[#0D1B2A] text-xs font-extrabold rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                    >
                      <option value="none">Fără asociere proiect</option>
                      {savedProjects.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.location})</option>
                      ))}
                      <option value="proj_cahul_center">Șantier Bloc Cahul Centru (str. Sanatoriului)</option>
                      <option value="proj_cantemir_villa">Renovare Casă Cantemir</option>
                    </select>
                  </div>
                )}

                {/* FORM FIELDS */}
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                        Prenume <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Ion"
                        value={customerData.firstName}
                        onChange={(e) => setCustomerData({ ...customerData, firstName: e.target.value })}
                        className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                        Nume <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Popescu"
                        value={customerData.lastName}
                        onChange={(e) => setCustomerData({ ...customerData, lastName: e.target.value })}
                        className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                        Telefon (Republica Moldova) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="+373 69 000 000"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-mono font-bold rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                        Adresă E-mail <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="nume@domain.md"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value.toLowerCase().trim() })}
                        className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                      />
                    </div>
                  </div>

                  {/* COMPANY SPECIFIC FIELDS */}
                  {customerType === 'company' && (
                    <div className="bg-[#EFFAF6]/50 border border-[#00A878]/30 rounded-2xl p-4 space-y-4 mt-2">
                      <p className="text-xs font-extrabold text-[#087F5B] flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        <span>Date fiscale companie (Demonstrative)</span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                            Denumirea companiei <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="ex: Constructia Sud SRL"
                            value={customerData.companyName || ''}
                            onChange={(e) => setCustomerData({ ...customerData, companyName: e.target.value })}
                            className="w-full bg-white text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                            IDNO / Cod Fiscal <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="ex: 1003600012345"
                            value={customerData.idno || ''}
                            onChange={(e) => setCustomerData({ ...customerData, idno: e.target.value })}
                            className="w-full bg-white text-[#0D1B2A] text-xs font-mono font-bold rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                          Adresa juridică <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="ex: mun. Cahul, str. Independenței 45"
                          value={customerData.legalAddress || ''}
                          onChange={(e) => setCustomerData({ ...customerData, legalAddress: e.target.value })}
                          className="w-full bg-white text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                      Observații sau număr intern de comandă (opțional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Mențiuni speciale pentru procesarea comenzii..."
                      value={customerData.notes || ''}
                      onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                      className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                    />
                  </div>

                </div>

                {stepErrors[1] && (
                  <p className="text-xs text-rose-600 font-extrabold bg-rose-50 p-3 rounded-xl border border-rose-200">
                    {stepErrors[1]}
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-6 py-3.5 rounded-2xl transition-colors flex items-center gap-2 text-xs cursor-pointer shadow-xs"
                  >
                    <span>Continuă la Primire</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: FULFILLMENT & LOGISTICS */}
            {currentStep === 2 && (
              <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 space-y-6 shadow-xs animate-in fade-in duration-200">

                <div className="border-b border-[#D9E2E1] pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-[#0D1B2A] flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#087F5B]" />
                      <span>2. Metodă de primire și logistică</span>
                    </h2>
                    <p className="text-xs text-[#5C6670] mt-0.5">Alege modul în care dorești să intri în posesia produselor CodeBau.</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-extrabold text-[#087F5B] hover:underline cursor-pointer"
                  >
                    Editează pasul 1
                  </button>
                </div>

                {/* Receiving Method Radio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Store Pickup */}
                  <button
                    type="button"
                    onClick={() => setReceivingMethod('store_pickup')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 cursor-pointer ${
                      receivingMethod === 'store_pickup'
                        ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] shadow-xs'
                        : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Store className="w-5 h-5 text-[#087F5B]" />
                      <span className="text-[10px] bg-[#DDF5EE] text-[#087F5B] font-extrabold px-2 py-0.5 rounded border border-[#00A878]/30">
                        GRATUIT
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#0D1B2A]">Ridicare din magazin</h4>
                      <p className="text-[11px] text-[#5C6670] mt-0.5 font-medium">{selectedStore}</p>
                    </div>
                  </button>

                  {/* Delivery to Address */}
                  <button
                    type="button"
                    onClick={() => setReceivingMethod('delivery')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 cursor-pointer ${
                      receivingMethod === 'delivery'
                        ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] shadow-xs'
                        : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Truck className="w-5 h-5 text-[#087F5B]" />
                      <span className="text-[10px] font-extrabold text-[#0D1B2A]">
                        {deliveryQuote.formattedText}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#0D1B2A]">Livrare la adresă / șantier</h4>
                      <p className="text-[11px] text-[#5C6670] mt-0.5 font-medium">Sudul Moldovei • Camion macara</p>
                    </div>
                  </button>

                  {/* Locker 24/7 */}
                  <button
                    type="button"
                    onClick={() => setReceivingMethod('locker_247')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 cursor-pointer ${
                      receivingMethod === 'locker_247'
                        ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] shadow-xs'
                        : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-[#087F5B]" />
                      <span className="text-[10px] bg-[#DDF5EE] text-[#087F5B] font-extrabold px-2 py-0.5 rounded border border-[#00A878]/30">
                        GRATUIT 24/7
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#0D1B2A]">Ridicare Locker 24/7</h4>
                      <p className="text-[11px] text-[#5C6670] mt-0.5 font-medium">Acces securizat cu QR Code</p>
                    </div>
                  </button>
                </div>

                {/* DETAILS FOR STORE PICKUP */}
                {receivingMethod === 'store_pickup' && (
                  <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9E2E1] pb-3">
                      <div>
                        <p className="text-[10px] text-[#087F5B] font-extrabold uppercase">Magazin selectat pentru ridicare</p>
                        <h3 className="font-extrabold text-[#0D1B2A] text-sm">{activeStoreObj.name}</h3>
                        <p className="text-xs text-[#5C6670] font-medium">{activeStoreObj.address}, {activeStoreObj.town} • {activeStoreObj.schedule}</p>
                      </div>

                      <div className="flex gap-2">
                        {MOCK_STORES.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleStoreChangeRequest(s.name)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition-colors cursor-pointer ${
                              s.name === selectedStore ? 'bg-[#087F5B] text-white' : 'bg-white text-[#0D1B2A] border border-[#D9E2E1]'
                            }`}
                          >
                            {s.town.replace('mun. ', '').replace('orașul ', '')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {!stockValidation.isValid && (
                      <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-xl p-3 text-xs text-[#B45309]">
                        <p className="font-extrabold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                          <span>Atenție la stocul din {selectedStore}:</span>
                        </p>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                          {stockValidation.itemResults.filter(r => r.status !== 'available').map(res => (
                            <li key={res.productId}>
                              {res.productName}: {res.status === 'insufficient' ? `Stoc limitat (${res.availableQty} unități)` : 'Indisponibil local'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                          Numele persoanei care ridică
                        </label>
                        <input
                          type="text"
                          value={pickupPersonName}
                          onChange={(e) => setPickupPersonName(e.target.value)}
                          className="w-full bg-white text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                          Telefon de contact la ridicare
                        </label>
                        <input
                          type="text"
                          value={pickupPersonPhone}
                          onChange={(e) => setPickupPersonPhone(e.target.value)}
                          className="w-full bg-white text-[#0D1B2A] text-xs font-mono font-bold rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-[#087F5B] font-extrabold flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Vei primi confirmare prin SMS când comanda este pregătită.</span>
                    </p>
                  </div>
                )}

                {/* DETAILS FOR ADDRESS DELIVERY */}
                {receivingMethod === 'delivery' && (
                  <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-5 space-y-4">
                    <h3 className="font-extrabold text-[#0D1B2A] text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#087F5B]" />
                      <span>Adresă și servicii de livrare în sudul Republicii Moldova</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                          Localitate <span className="text-rose-600">*</span>
                        </label>
                        <select
                          value={deliveryAddress.locality}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'custom') {
                              setDeliveryAddress({ ...deliveryAddress, locality: '', isManualLocality: true });
                            } else {
                              setDeliveryAddress({ ...deliveryAddress, locality: val, isManualLocality: false });
                            }
                          }}
                          className="w-full bg-white text-[#0D1B2A] text-xs font-bold rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                        >
                          <option value="mun. Cahul">mun. Cahul</option>
                          <option value="orașul Cantemir">orașul Cantemir</option>
                          <option value="orașul Vulcănești">orașul Vulcănești</option>
                          <option value="orașul Taraclia">orașul Taraclia</option>
                          <option value="satul Roșu, raionul Cahul">satul Roșu</option>
                          <option value="satul Crihana Veche">satul Crihana Veche</option>
                          <option value="satul Giurgiulești">satul Giurgiulești</option>
                          <option value="satul Slobozia Mare">satul Slobozia Mare</option>
                          <option value="custom">Localitatea mea nu apare în listă...</option>
                        </select>
                      </div>

                      {deliveryAddress.isManualLocality && (
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                            Introduceți localitatea dvs. <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="ex: satul Larga Nouă"
                            value={deliveryAddress.locality}
                            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, locality: e.target.value })}
                            className="w-full bg-white text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                          />
                        </div>
                      )}

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                          Stradă și Număr <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="ex: str. Ștefan cel Mare 14"
                          value={deliveryAddress.street + (deliveryAddress.number ? ` ${deliveryAddress.number}` : '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDeliveryAddress({ ...deliveryAddress, street: val, number: '14' });
                          }}
                          className="w-full bg-white text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                          Nume persoană de contact livrare
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress.recipientName}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, recipientName: e.target.value })}
                          className="w-full bg-white text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">
                          Telefon pentru șofer <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress.recipientPhone}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, recipientPhone: e.target.value })}
                          className="w-full bg-white text-[#0D1B2A] text-xs font-mono font-bold rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                        />
                      </div>
                    </div>

                    {/* Delivery Extra Services */}
                    <div className="border-t border-[#D9E2E1] pt-3 space-y-2">
                      <label className="block text-xs font-extrabold text-[#0D1B2A]">Servicii logistice suplimentare:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#D9E2E1] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!extraServices.unloading}
                            onChange={(e) => setExtraServices({ ...extraServices, unloading: e.target.checked })}
                            className="rounded border-[#D9E2E1] text-[#087F5B] focus:ring-[#087F5B]"
                          />
                          <span className="font-bold text-[#0D1B2A]">Descărcare cu macara / mecanic (+40 MDL)</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#D9E2E1] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!extraServices.callBeforeArrival}
                            onChange={(e) => setExtraServices({ ...extraServices, callBeforeArrival: e.target.checked })}
                            className="rounded border-[#D9E2E1] text-[#087F5B] focus:ring-[#087F5B]"
                          />
                          <span className="font-bold text-[#0D1B2A]">Apel cu 30 min înainte de sosire</span>
                        </label>
                      </div>
                    </div>

                    {/* Save address checkbox */}
                    {currentRole !== 'visitor' && (
                      <label className="flex items-center gap-2 text-xs font-extrabold text-[#087F5B] pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveAddressToAccount}
                          onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                          className="rounded text-[#087F5B]"
                        />
                        <span>Salvează această adresă în contul meu CodeBau</span>
                      </label>
                    )}
                  </div>
                )}

                {/* DETAILS FOR LOCKER 24/7 */}
                {receivingMethod === 'locker_247' && (
                  <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-5 space-y-4">
                    {!isLockerEligible ? (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 space-y-2">
                        <p className="font-black flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Anumite produse din coș depășesc dimensiunile admise ale Locker-ului 24/7!</span>
                        </p>
                        <p className="text-[11px] font-medium">Produse neeligibile pentru locker:</p>
                        <ul className="list-disc list-inside text-[11px] font-bold">
                          {ineligibleLockerItems.map(i => (
                            <li key={i.product.id}>{i.product.name} ({i.quantity} {i.product.unit})</li>
                          ))}
                        </ul>
                        <p className="text-[11px] pt-1 font-semibold">
                          Vă rugăm să selectați Ridicare din magazin sau Livrare la șantier.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-[#EFFAF6] border border-[#00A878]/30 rounded-xl p-3.5 text-xs text-[#087F5B]">
                          <QrCode className="w-6 h-6 shrink-0" />
                          <div>
                            <p className="font-black">Locker 24/7 {selectedStore} este pregătit!</p>
                            <p className="text-[11px] font-medium text-[#5C6670] mt-0.5">
                              După pregătirea comenzii, vei primi un QR Code și PIN securizat prin SMS pentru deblocare oricând, 24/7.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* DATE & TIME SLOT SELECTOR */}
                <div className="border-t border-[#D9E2E1] pt-4 space-y-3">
                  <label className="block text-xs font-extrabold text-[#0D1B2A] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#087F5B]" />
                    <span>Selectează data și intervalul orar de test</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#5C6670] mb-1">Data solicitată</label>
                      <input
                        type="date"
                        min={todayStr}
                        value={requestedDate}
                        onChange={(e) => setRequestedDate(e.target.value)}
                        className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-extrabold rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#5C6670] mb-1">Interval orar</label>
                      <select
                        value={requestedTimeSlot}
                        onChange={(e) => setRequestedTimeSlot(e.target.value)}
                        className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-extrabold rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                      >
                        <option value="08:00 - 12:00">08:00 - 12:00 (Dimineața)</option>
                        <option value="12:00 - 16:00">12:00 - 16:00 (Amiază)</option>
                        <option value="16:00 - 18:00">16:00 - 18:00 (Dupa-amiază)</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5C6670] font-medium italic">
                    * Interval de test — termenul final va fi confirmat de consultant.
                  </p>
                </div>

                {stepErrors[2] && (
                  <p className="text-xs text-rose-600 font-extrabold bg-rose-50 p-3 rounded-xl border border-rose-200">
                    {stepErrors[2]}
                  </p>
                )}

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="bg-[#F8FAF9] hover:bg-[#D9E2E1]/50 text-[#0D1B2A] font-extrabold px-5 py-3 rounded-2xl transition-colors text-xs border border-[#D9E2E1] cursor-pointer"
                  >
                    Înapoi la Pasul 1
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-6 py-3.5 rounded-2xl transition-colors flex items-center gap-2 text-xs cursor-pointer shadow-xs"
                  >
                    <span>Verificare Comandă</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: VERIFICATION & CONFIRMATION */}
            {currentStep === 3 && (
              <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 space-y-6 shadow-xs animate-in fade-in duration-200">

                <div className="border-b border-[#D9E2E1] pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-[#0D1B2A] flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#087F5B]" />
                      <span>3. Verificare finală și confirmare</span>
                    </h2>
                    <p className="text-xs text-[#5C6670] mt-0.5">Verifică detaliile introduse și confirmă comanda de test.</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-extrabold text-[#087F5B] hover:underline cursor-pointer"
                  >
                    Modifică tot
                  </button>
                </div>

                {/* EDITABLE REVIEW CARDS (REQ #18) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Client Card */}
                  <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center border-b border-[#D9E2E1] pb-2">
                      <span className="font-extrabold text-[#0D1B2A] flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#087F5B]" /> Date Client
                      </span>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-[11px] font-extrabold text-[#087F5B] hover:underline cursor-pointer"
                      >
                        Modifică
                      </button>
                    </div>
                    <p className="font-bold text-[#0D1B2A]">{customerData.firstName} {customerData.lastName}</p>
                    <p className="text-[#5C6670] font-mono">{customerData.phone} • {customerData.email}</p>
                    {customerType === 'company' && (
                      <p className="text-[#087F5B] font-bold mt-1">
                        Companie: {customerData.companyName} (IDNO: {customerData.idno})
                      </p>
                    )}
                  </div>

                  {/* Fulfillment Card */}
                  <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center border-b border-[#D9E2E1] pb-2">
                      <span className="font-extrabold text-[#0D1B2A] flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-[#087F5B]" /> Primire & Magazin
                      </span>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-[11px] font-extrabold text-[#087F5B] hover:underline cursor-pointer"
                      >
                        Modifică
                      </button>
                    </div>
                    <p className="font-bold text-[#0D1B2A]">
                      {receivingMethod === 'store_pickup' && `Ridicare din ${selectedStore}`}
                      {receivingMethod === 'delivery' && `Livrare în ${deliveryAddress.locality}`}
                      {receivingMethod === 'locker_247' && `Locker 24/7 ${selectedStore}`}
                    </p>
                    <p className="text-[#5C6670] font-medium">
                      Data solicitată: <strong>{requestedDate}</strong> ({requestedTimeSlot})
                    </p>
                  </div>

                </div>

                {/* PRODUCT LIST REVIEW */}
                <div className="border border-[#D9E2E1] rounded-2xl overflow-hidden text-xs">
                  <div className="bg-[#F8FAF9] p-3 border-b border-[#D9E2E1] flex justify-between items-center font-extrabold text-[#0D1B2A]">
                    <span>Produse comandate ({cartItems.length})</span>
                    <button onClick={onNavigateToCart} className="text-[#087F5B] text-[11px] hover:underline cursor-pointer">
                      Modifică în coș
                    </button>
                  </div>

                  <div className="divide-y divide-[#D9E2E1]">
                    {cartItems.map(item => (
                      <div key={item.product.id} className="p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-xl border border-[#D9E2E1]" />
                          <div>
                            <p className="font-bold text-[#0D1B2A] line-clamp-1">{item.product.name}</p>
                            <p className="text-[11px] text-[#5C6670] font-mono">
                              {item.quantity} {item.product.unit} × {formatMoney(item.appliedPrice)}
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-[#0D1B2A] shrink-0">
                          {formatMoney(item.appliedPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PAYMENT METHOD SELECTOR (DEMO ONLY - REQ #28) */}
                <div className="space-y-3 border-t border-[#D9E2E1] pt-4">
                  <label className="block text-xs font-extrabold text-[#0D1B2A] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#087F5B]" />
                    <span>Selectează modalitatea demonstrativă de plată</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'pay_on_pickup' ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B]' : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A]'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'pay_on_pickup'}
                        onChange={() => setPaymentMethod('pay_on_pickup')}
                        className="text-[#087F5B]"
                      />
                      <div>
                        <p className="font-extrabold">Plată la ridicare (Numerar / Card)</p>
                        <p className="text-[11px] text-[#5C6670]">În magazin la casă sau la locker</p>
                      </div>
                    </label>

                    <label className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'pay_on_delivery' ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B]' : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A]'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'pay_on_delivery'}
                        onChange={() => setPaymentMethod('pay_on_delivery')}
                        className="text-[#087F5B]"
                      />
                      <div>
                        <p className="font-extrabold">Plată la livrare pe șantier</p>
                        <p className="text-[11px] text-[#5C6670]">Achitare la curier / șofer camion</p>
                      </div>
                    </label>

                    <label className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'bank_transfer_b2b' ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B]' : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A]'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'bank_transfer_b2b'}
                        onChange={() => setPaymentMethod('bank_transfer_b2b')}
                        className="text-[#087F5B]"
                      />
                      <div>
                        <p className="font-extrabold">Transfer bancar B2B (Cont de plată)</p>
                        <p className="text-[11px] text-[#5C6670]">Emitem cont de plată demonstrativ</p>
                      </div>
                    </label>

                    <div className="p-3.5 rounded-2xl border border-[#D9E2E1] bg-gray-100 opacity-60 flex items-center gap-3 cursor-not-allowed">
                      <Lock className="w-4 h-4 text-[#5C6670]" />
                      <div>
                        <p className="font-extrabold text-[#5C6670]">Plată online cu cardul</p>
                        <p className="text-[11px] text-[#5C6670]">Indisponibilă în mediul de test</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MANDATORY TEST AGREEMENTS (REQ #19) */}
                <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-4 space-y-3 text-xs">
                  <label className="flex items-start gap-3 cursor-pointer font-bold text-[#0D1B2A]">
                    <input
                      type="checkbox"
                      checked={termsConfirmed}
                      onChange={(e) => setTermsConfirmed(e.target.checked)}
                      className="mt-0.5 rounded text-[#087F5B] focus:ring-[#087F5B]"
                    />
                    <span>
                      Confirm că datele introduse pentru această comandă de test sunt corecte. <span className="text-rose-600">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer font-medium text-[#5C6670]">
                    <input
                      type="checkbox"
                      checked={marketingAccepted}
                      onChange={(e) => setMarketingAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-[#087F5B] focus:ring-[#087F5B]"
                    />
                    <span>Doresc să primesc informații despre promoții, produse noi și oferte speciale CodeBau.</span>
                  </label>
                </div>

                {/* FINAL SUBMIT BUTTON */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full sm:w-auto bg-[#F8FAF9] hover:bg-[#D9E2E1]/50 text-[#0D1B2A] font-extrabold px-5 py-3 rounded-2xl transition-colors text-xs border border-[#D9E2E1] cursor-pointer"
                  >
                    Înapoi la Pasul 2
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting || !termsConfirmed}
                    onClick={handleFinalizeTestOrder}
                    className={`w-full sm:w-auto font-extrabold px-8 py-4 rounded-2xl text-white transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-md ${
                      isSubmitting || !termsConfirmed
                        ? 'bg-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-[#087F5B] hover:bg-[#066B4D]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Înregistrare comandă de test...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Confirmă comanda de test</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT STICKY SUMMARY COLUMN (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            
            <div className="bg-white border border-[#D9E2E1] rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-3">
                <h3 className="font-black text-[#0D1B2A] text-sm">Sumar Comandă CodeBau</h3>
                <span className="text-[10px] bg-[#DDF5EE] text-[#087F5B] font-extrabold px-2 py-0.5 rounded border border-[#00A878]/30">
                  {cartItems.length} {cartItems.length === 1 ? 'produs' : 'produse'}
                </span>
              </div>

              {/* Selected Store & Fulfillment Summary */}
              <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-3 text-xs space-y-1">
                <p className="text-[10px] text-[#5C6670] font-extrabold uppercase">Magazin & Primire</p>
                <p className="font-bold text-[#0D1B2A]">{activeStoreObj.name}</p>
                <p className="text-[11px] text-[#5C6670] font-medium">
                  {receivingMethod === 'store_pickup' && 'Ridicare din magazin (Gratuit)'}
                  {receivingMethod === 'delivery' && `Livrare în ${deliveryAddress.locality}`}
                  {receivingMethod === 'locker_247' && 'Locker 24/7 (Gratuit)'}
                </p>
              </div>

              {/* Item Lines Summary */}
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-[#D9E2E1]">
                {cartItems.map(item => (
                  <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-extrabold text-[#0D1B2A] line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-[#5C6670] font-mono">{item.quantity} {item.product.unit}</p>
                    </div>
                    <span className="font-black text-[#0D1B2A] shrink-0">{formatMoney(item.appliedPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* PRICE BREAKDOWN (REQ #16) */}
              <div className="space-y-2 text-xs border-t border-[#D9E2E1] pt-3" aria-live="polite">
                <div className="flex justify-between text-[#5C6670] font-medium">
                  <span>Subtotal produse:</span>
                  <span className="text-[#0D1B2A] font-extrabold">{formatMoney(subtotal)}</span>
                </div>

                {servicesCost > 0 && (
                  <div className="flex justify-between text-[#5C6670] font-medium">
                    <span>Servicii logistice:</span>
                    <span className="text-[#0D1B2A] font-extrabold">{formatMoney(servicesCost)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#5C6670] font-medium">
                  <span>Livrare:</span>
                  <span className="text-[#0D1B2A] font-extrabold">
                    {deliveryQuote.status === 'to_be_confirmed' ? (
                      <span className="text-[#B45309] font-bold">de confirmat</span>
                    ) : deliveryQuote.amountMDL !== null && deliveryQuote.amountMDL > 0 ? (
                      formatMoney(deliveryQuote.amountMDL)
                    ) : (
                      'Gratuit'
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[#5C6670] text-[11px] font-medium">
                  <span>Din care TVA (20%):</span>
                  <span>{formatMoney(vatAmount)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-[#087F5B] pt-3 border-t border-[#D9E2E1]">
                  <span>TOTAL ESTIMAT:</span>
                  <span>{formatMoney(estimatedTotal)}</span>
                </div>

                {deliveryQuote.status === 'to_be_confirmed' && (
                  <p className="text-[10px] text-[#B45309] bg-[#FEF3C7] p-2 rounded-xl border border-[#F59E0B]/30 font-medium">
                    * Costul livrării se confirmă separat de consultantul CodeBau.
                  </p>
                )}
              </div>

              <div className="space-y-2 text-[11px] text-[#5C6670] pt-2 border-t border-[#D9E2E1] font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#087F5B] shrink-0" />
                  <span>Stoc rezervat atomic & Comandă de test</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#087F5B] shrink-0" />
                  <span>Suport logistic local Cahul, Cantemir, Vulcănești, Taraclia</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* NEW PROJECT MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-extrabold text-[#0D1B2A] text-base">Creează proiect nou de șantier</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Denumire proiect</label>
                <input
                  type="text"
                  placeholder="ex: Renovare Vilă Cahul"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Localitate</label>
                <input
                  type="text"
                  value={newProjectLocality}
                  onChange={(e) => setNewProjectLocality(e.target.value)}
                  className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Adresă șantier</label>
                <input
                  type="text"
                  placeholder="ex: str. Victoriei 10"
                  value={newProjectAddress}
                  onChange={(e) => setNewProjectAddress(e.target.value)}
                  className="w-full bg-[#F8FAF9] text-[#0D1B2A] text-xs font-medium rounded-xl p-3 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="bg-[#F8FAF9] text-[#0D1B2A] text-xs font-extrabold px-4 py-2.5 rounded-xl border border-[#D9E2E1]"
              >
                Anulează
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newProjectTitle && onAddProject) {
                    const newProj: SavedProject = {
                      id: `proj_${Date.now()}`,
                      title: newProjectTitle,
                      clientName: `${customerData.firstName} ${customerData.lastName}`,
                      location: `${newProjectLocality}, ${newProjectAddress}`,
                      budget: estimatedTotal,
                      status: 'in_progress',
                      items: cartItems,
                      notes: 'Creat din Checkout',
                      createdAt: new Date().toISOString()
                    };
                    onAddProject(newProj);
                    setSelectedProjectId(newProj.id);
                  }
                  setShowNewProjectModal(false);
                }}
                className="bg-[#087F5B] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl"
              >
                Salvează Proiect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM BAR (REQ #30) */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-[#D9E2E1] p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-[#5C6670] uppercase font-extrabold">Total estimat ({cartItems.length} prod.)</p>
          <p className="text-sm font-black text-[#087F5B]">{formatMoney(estimatedTotal)}</p>
        </div>

        <button
          onClick={() => {
            if (currentStep < 3) handleNextStep();
            else handleFinalizeTestOrder();
          }}
          disabled={isSubmitting || (currentStep === 3 && !termsConfirmed)}
          className={`px-5 py-3 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs ${
            isSubmitting || (currentStep === 3 && !termsConfirmed)
              ? 'bg-gray-400'
              : 'bg-[#087F5B]'
          }`}
        >
          <span>{currentStep === 3 ? 'Confirmă comanda de test' : 'Pasul următor'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
