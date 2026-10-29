/**
 * Central Module Registry (OWNER: Member 1 - Team Lead)
 * 
 * Rules:
 * Teammates develop inside their own src/modules/<name>/ folders.
 * This registry automatically connects them to routing, navigation, and the demo flow.
 */

import cropDoctorModule from '../modules/crop-doctor';
import marketPricesModule from '../modules/market-prices';
import buyerMatchingModule from '../modules/buyer-matching';
import netReturnModule from '../modules/net-return';
import fpoSupportModule from '../modules/fpo-support';
import logisticsModule from '../modules/logistics';
import hindiAssistantModule from '../modules/hindi-assistant';

export const ALL_MODULES = [
  cropDoctorModule,
  marketPricesModule,
  buyerMatchingModule,
  netReturnModule,
  fpoSupportModule,
  logisticsModule,
  hindiAssistantModule,
];

// 6-step Judge Demo Flow in exact requested order
export const DEMO_FLOW_MODULES = [
  cropDoctorModule,     // Step 1
  marketPricesModule,   // Step 2
  buyerMatchingModule,  // Step 3
  netReturnModule,      // Step 4
  fpoSupportModule,     // Step 5
  logisticsModule,      // Step 6
];

export function getModuleById(id) {
  return ALL_MODULES.find((m) => m.id === id);
}

export function getModuleByPath(path) {
  return ALL_MODULES.find((m) => m.path === path);
}
