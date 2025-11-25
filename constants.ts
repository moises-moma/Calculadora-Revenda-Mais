
import { BasePlan, AdditionalService, WebsiteOption, CrmOption, AdditionalProduct } from './types';

export const PLANS: BasePlan[] = [
  { id: 'p0.5', name: 'Plano 0.5 (S/Mod. Financeiro)', vehicles: 25, users: 5, storage: '1GB', monthlyPrice: 450, annualPrice: 400 },
  { id: 'p1.0', name: 'Plano 1.0', vehicles: 50, users: 10, storage: '2GB', monthlyPrice: 550, annualPrice: 500 },
  { id: 'p2.0', name: 'Plano 2.0', vehicles: 100, users: 15, storage: '3GB', monthlyPrice: 750, annualPrice: 700 },
  { id: 'p3.0', name: 'Plano 3.0', vehicles: 150, users: 20, storage: '4GB', monthlyPrice: 850, annualPrice: 800 },
];

export const SERVICES: AdditionalService[] = [
  { id: 'nf', name: 'Notas Fiscais', monthlyPrice: 250, annualPrice: 200 },
  { id: 'assinatura', name: 'Assinatura Eletrônica', monthlyPrice: 50, annualPrice: 50 },
  { id: 'renave', name: 'Integração Renave', monthlyPrice: 30, annualPrice: 30 },
];

export const WEBSITES: WebsiteOption[] = [
  { id: 'top', name: 'Modelo TOP', price: 2000 },
  { id: 'super', name: 'Modelo SUPER', price: 4500 },
];

export const CRM_OPTIONS: CrmOption[] = [
  { id: 'whats', name: 'Integração Whats (3 usuários)', price: 240, setupFee: 390 },
  { id: 'no_whats', name: 'Sem Integração Whats (3 usuários)', price: 150, setupFee: 0 },
];

export const ADDITIONAL_PRODUCTS: AdditionalProduct[] = [
  { id: 'storage', name: 'Armazenamento Adicional', price: 15 },
  { id: 'user', name: 'Usuário Adicional (s/chat premium)', price: 20 },
  { id: 'user_premium', name: 'Usuário Adicional (c/chat premium)', price: 50 },
  { id: 'cnpj', name: 'CNPJ Adicional', price: 90 },
];

export const ADHESION_FEE = 1000;