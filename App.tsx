import React, { useState, useMemo } from 'react';
import { 
  PLANS, 
  SERVICES, 
  WEBSITES, 
  CRM_OPTIONS, 
  ADDITIONAL_PRODUCTS, 
  ADHESION_FEE 
} from './constants';
import { SectionHeader } from './components/SectionHeader';
import { 
  Calculator, 
  Check, 
  Layout, 
  Monitor, 
  Users, 
  HardDrive, 
  Plus, 
  Car,
  BadgePercent
} from 'lucide-react';
import { CartState } from './types';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
};

export default function App() {
  const [state, setState] = useState<CartState>({
    selectedPlanId: PLANS[0].id,
    selectedServices: [],
    selectedWebsiteId: null,
    isWebsiteBonused: false,
    selectedCrmId: null,
    productQuantities: ADDITIONAL_PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {} as Record<string, number>),
  });

  // Handlers
  const toggleService = (id: string) => {
    setState(prev => {
      const exists = prev.selectedServices.includes(id);
      return {
        ...prev,
        selectedServices: exists 
          ? prev.selectedServices.filter(s => s !== id)
          : [...prev.selectedServices, id]
      };
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setState(prev => ({
      ...prev,
      productQuantities: {
        ...prev.productQuantities,
        [id]: Math.max(0, (prev.productQuantities[id] || 0) + delta)
      }
    }));
  };

  // Calculations
  const calculations = useMemo(() => {
    const plan = PLANS.find(p => p.id === state.selectedPlanId)!;
    
    // Base Monthly Costs
    let monthlyBase = plan.monthlyPrice;
    let annualBase = plan.annualPrice; // This is the discounted monthly rate

    // Services
    state.selectedServices.forEach(srvId => {
      const srv = SERVICES.find(s => s.id === srvId)!;
      monthlyBase += srv.monthlyPrice;
      const serviceAnnualPrice = srv.annualPrice ?? srv.monthlyPrice;
      annualBase += serviceAnnualPrice;
    });

    // CRM
    let crmMonthly = 0;
    let crmSetup = 0;
    if (state.selectedCrmId) {
      const crm = CRM_OPTIONS.find(c => c.id === state.selectedCrmId)!;
      crmMonthly += crm.price;
      crmSetup += crm.setupFee;
    }

    // Additional Products
    let productsTotal = 0;
    Object.entries(state.productQuantities).forEach(([id, qty]) => {
      const prod = ADDITIONAL_PRODUCTS.find(p => p.id === id);
      if (prod) {
        productsTotal += prod.price * qty;
      }
    });

    const totalMonthlyRecurring = monthlyBase + crmMonthly + productsTotal;
    const totalAnnualRecurring = annualBase + crmMonthly + productsTotal;

    // Website Setup
    let websiteSetup = 0;
    if (state.selectedWebsiteId) {
      const site = WEBSITES.find(w => w.id === state.selectedWebsiteId)!;
      if (!state.isWebsiteBonused) {
        websiteSetup = site.price;
      }
    }

    // Totals per period
    // 1 Month: Adhesion + Website + CRM Setup + (MonthlyRate * 1)
    const total1Month = {
      adhesion: ADHESION_FEE,
      setupExtra: websiteSetup + crmSetup,
      monthly: totalMonthlyRecurring,
      total: ADHESION_FEE + websiteSetup + crmSetup + totalMonthlyRecurring
    };

    // 3 Months: Adhesion (Free) + Website + CRM Setup + (MonthlyRate * 3)
    const total3Months = {
      adhesion: 0,
      setupExtra: websiteSetup + crmSetup,
      monthly: 0, 
      packageTotal: websiteSetup + crmSetup + (totalMonthlyRecurring * 3)
    };

    // 12 Months: Adhesion (Free) + Website + CRM Setup + (AnnualRate * 12)
    const total12Months = {
      adhesion: 0,
      setupExtra: websiteSetup + crmSetup,
      monthly: 0,
      packageTotal: websiteSetup + crmSetup + (totalAnnualRecurring * 12)
    };

    return {
      plan,
      monthlyRecurring: totalMonthlyRecurring, 
      annualRecurring: totalAnnualRecurring,
      total1Month,
      total3Months,
      total12Months
    };

  }, [state]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-[1800px] mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-brand-red text-white flex items-center justify-center rounded-lg shadow-sm">
                <span className="font-bold text-xl tracking-tighter">RM</span>
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">RevendaMais</h1>
                <p className="text-sm text-gray-500">Calculadora de Planos</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-red"></div>
                <span>Tabela Vigente 2024</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Configuration (Wider) */}
          <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
            
            {/* ROW 1: PLANS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SectionHeader title="1. Escolha o Plano" icon={<Monitor size={18} />} />
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLANS.map(plan => {
                  const isSelected = state.selectedPlanId === plan.id;
                  return (
                    <div 
                      key={plan.id}
                      onClick={() => setState(s => ({ ...s, selectedPlanId: plan.id }))}
                      className={`
                        relative cursor-pointer flex flex-col p-4 rounded-lg border-2 transition-all duration-200 group
                        ${isSelected 
                          ? 'border-brand-red bg-red-50/50 shadow-md ring-1 ring-brand-red/20' 
                          : 'border-gray-100 hover:border-brand-red/30 hover:shadow-sm bg-white'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-3">
                         <h3 className={`font-bold text-lg ${isSelected ? 'text-brand-red' : 'text-gray-800'}`}>
                           {plan.name}
                         </h3>
                         <div className={`
                            w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                            ${isSelected ? 'border-brand-red bg-brand-red text-white' : 'border-gray-300'}
                         `}>
                            {isSelected && <Check size={12} />}
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4 text-gray-600">
                        <Car size={16} />
                        <span className="font-medium">{plan.vehicles} Veículos</span>
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-100 space-y-1">
                        <div className="flex justify-between items-baseline">
                           <span className="text-xs text-gray-500 uppercase">Mensal</span>
                           <span className="font-bold text-gray-900">{formatCurrency(plan.monthlyPrice)}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                           <span className="text-xs text-green-600 uppercase font-semibold">Anual</span>
                           <span className="font-bold text-green-700">{formatCurrency(plan.annualPrice)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ROW 2: SERVICES */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SectionHeader title="2. Serviços Adicionais" icon={<Plus size={18} />} />
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SERVICES.map(service => {
                  const isSelected = state.selectedServices.includes(service.id);
                  return (
                    <div 
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`
                        cursor-pointer flex flex-col p-3 rounded-lg border transition-all h-full
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                      `}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="font-semibold text-sm text-gray-800 leading-snug">{service.name}</span>
                        <div className={`
                          shrink-0 w-4 h-4 rounded border flex items-center justify-center mt-0.5
                          ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 bg-white'}
                        `}>
                          {isSelected && <Check size={10} />}
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-2 text-xs">
                        {service.annualPrice && service.annualPrice !== service.monthlyPrice ? (
                            <div className="space-y-0.5">
                                <div className="flex justify-between text-gray-500">
                                  <span>Mensal:</span>
                                  <span>{formatCurrency(service.monthlyPrice)}</span>
                                </div>
                                <div className="flex justify-between text-green-700 font-medium">
                                  <span>Anual:</span>
                                  <span>{formatCurrency(service.annualPrice)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="font-semibold text-gray-700 text-right">
                              {formatCurrency(service.monthlyPrice)}
                            </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ROW 3: WEB / CRM / EXTRAS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* WEBSITE */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <SectionHeader title="3. Website" icon={<Layout size={18} />} />
                <div className="p-4 space-y-3 flex-1">
                  {WEBSITES.map(site => (
                    <div 
                      key={site.id}
                      onClick={() => setState(s => ({ 
                        ...s, 
                        selectedWebsiteId: s.selectedWebsiteId === site.id ? null : site.id 
                      }))}
                      className={`
                        cursor-pointer flex items-center justify-between p-3 rounded-lg border transition-all
                        ${state.selectedWebsiteId === site.id 
                          ? 'border-brand-red bg-red-50/50' 
                          : 'border-gray-200 hover:bg-gray-50'}
                      `}
                    >
                      <span className="font-medium text-sm text-gray-700">{site.name}</span>
                      <span className="font-bold text-sm text-gray-900">{formatCurrency(site.price)}</span>
                    </div>
                  ))}
                  
                  {state.selectedWebsiteId && (
                    <div className="flex items-center gap-2 mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                       <input 
                        type="checkbox" 
                        id="bonus-site"
                        checked={state.isWebsiteBonused}
                        onChange={(e) => setState(s => ({ ...s, isWebsiteBonused: e.target.checked }))}
                        className="rounded text-brand-red focus:ring-brand-red h-4 w-4"
                      />
                      <label htmlFor="bonus-site" className="text-yellow-800 font-bold text-xs uppercase cursor-pointer select-none flex items-center gap-1">
                        <BadgePercent size={14} />
                        Bonificado (Isentar Taxa)
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* CRM */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <SectionHeader title="4. CRM" icon={<Users size={18} />} />
                <div className="p-4 space-y-3 flex-1">
                  {CRM_OPTIONS.map(crm => (
                    <div 
                      key={crm.id}
                      onClick={() => setState(s => ({ 
                          ...s, 
                          selectedCrmId: s.selectedCrmId === crm.id ? null : crm.id 
                      }))}
                      className={`
                        cursor-pointer p-3 rounded-lg border transition-all relative
                        ${state.selectedCrmId === crm.id 
                          ? 'border-brand-red bg-red-50/50' 
                          : 'border-gray-200 hover:bg-gray-50'}
                      `}
                    >
                      <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm text-gray-700">{crm.name}</span>
                          <span className="font-bold text-sm text-gray-900">{formatCurrency(crm.price)}</span>
                      </div>
                      {crm.setupFee > 0 && (
                          <div className="text-[10px] text-brand-red font-bold uppercase flex items-center gap-1">
                              + Setup {formatCurrency(crm.setupFee)}
                          </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <SectionHeader title="5. Extras" icon={<HardDrive size={18} />} />
                <div className="p-4 space-y-3 flex-1">
                  {ADDITIONAL_PRODUCTS.map(prod => (
                    <div key={prod.id} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0">
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium text-sm">{prod.name}</span>
                        <span className="text-gray-400 text-xs">{formatCurrency(prod.price)}/un</span>
                      </div>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => updateQuantity(prod.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 active:bg-gray-200"
                        >
                          -
                        </button>
                        <div className="w-8 text-center font-bold text-sm">
                          {state.productQuantities[prod.id] || 0}
                        </div>
                        <button 
                          onClick={() => updateQuantity(prod.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 active:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Summary (Sticky) */}
          <div className="xl:col-span-4 2xl:col-span-3">
              <div className="sticky top-6">
                  <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 ring-1 ring-gray-900/5">
                      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                          <h2 className="font-bold text-lg flex items-center gap-2">
                              <Calculator size={20} className="text-brand-red" />
                              Resumo Final
                          </h2>
                          <div className="flex gap-2 text-gray-300">
                             <Car size={16} /> 
                             <span className="text-xs font-mono bg-gray-800 border border-gray-700 px-2 py-0.5 rounded text-white">
                               {calculations.plan.vehicles}
                             </span>
                          </div>
                      </div>

                      {/* Main Table */}
                      <div className="overflow-x-auto">
                          <table className="w-full text-center text-sm border-collapse">
                              <thead>
                                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-xs uppercase tracking-wider">
                                      <th className="p-3 text-left font-semibold">Item</th>
                                      <th className="p-3 font-semibold border-l border-gray-100">1 Mês</th>
                                      <th className="p-3 font-semibold border-l border-gray-100 text-green-700">3 Meses</th>
                                      <th className="p-3 font-semibold border-l border-gray-100 text-brand-red">12 Meses</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                                  
                                  {/* Adhesion Fee */}
                                  <tr className="hover:bg-gray-50/50">
                                      <td className="p-3 text-left font-medium text-gray-500">Adesão</td>
                                      <td className="p-3 border-l border-gray-100 text-brand-red font-bold">
                                          {formatCurrency(calculations.total1Month.adhesion)}
                                      </td>
                                      <td className="p-3 border-l border-gray-100 text-green-600 font-bold bg-green-50/30">Free</td>
                                      <td className="p-3 border-l border-gray-100 text-green-600 font-bold bg-green-50/30">Free</td>
                                  </tr>

                                  {/* Setup Fees */}
                                  {(calculations.total1Month.setupExtra > 0) && (
                                      <tr className="hover:bg-gray-50/50">
                                          <td className="p-3 text-left font-medium text-gray-500">Setup</td>
                                          <td className="p-3 border-l border-gray-100 font-medium">
                                              {formatCurrency(calculations.total1Month.setupExtra)}
                                          </td>
                                          <td className="p-3 border-l border-gray-100 font-medium">
                                              {formatCurrency(calculations.total3Months.setupExtra)}
                                          </td>
                                          <td className="p-3 border-l border-gray-100 font-medium">
                                              {formatCurrency(calculations.total12Months.setupExtra)}
                                          </td>
                                      </tr>
                                  )}

                                  {/* Recurring */}
                                  <tr className="bg-blue-50/30">
                                      <td className="p-3 text-left font-semibold text-blue-900">
                                          Mensal
                                      </td>
                                      <td className="p-3 border-l border-blue-100 font-bold text-blue-700">
                                          {formatCurrency(calculations.total1Month.monthly)}
                                      </td>
                                      <td className="p-3 border-l border-blue-100 font-bold text-blue-700">
                                          {formatCurrency(calculations.total1Month.monthly)}
                                      </td>
                                      <td className="p-3 border-l border-blue-100 font-bold text-blue-700">
                                          {formatCurrency(calculations.annualRecurring)}
                                      </td>
                                  </tr>

                                  {/* TOTALS */}
                                  <tr className="border-t-2 border-gray-100">
                                      <td className="p-3 text-left font-bold text-gray-800">Total</td>
                                      <td className="p-3 border-l border-gray-100 font-black text-gray-900">
                                          {formatCurrency(calculations.total1Month.total)}
                                      </td>
                                      <td className="p-3 border-l border-gray-100 font-black text-gray-900">
                                          {formatCurrency(calculations.total3Months.packageTotal)}
                                      </td>
                                      <td className="p-3 border-l border-gray-100 font-black text-gray-900 bg-red-50/50 text-brand-red">
                                          {formatCurrency(calculations.total12Months.packageTotal)}
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>

                      <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-3">
                          <div className="flex items-start gap-2 text-xs text-gray-600">
                             <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1"></div>
                             <p><strong>1 Mês:</strong> Adesão + Setup + 1ª Mensalidade.</p>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-600">
                             <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1"></div>
                             <p><strong>3 Meses:</strong> Setup + (Mensalidade x 3). Parcelamento em até 3x no cartão.</p>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-600">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1"></div>
                             <p className="text-brand-red font-medium"><strong>12 Meses:</strong> Setup + (Mensalidade Anual x 12). Parcelamento em até 12x no cartão.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}