import { Calculator } from 'lucide-react';
import NetReturnPage from './NetReturnPage';

export const netReturnModule = {
  id: 'net-return',
  name: 'Net Return Calculator',
  hindiName: 'शुद्ध मुनाफा कैलकुलेटर',
  path: '/net-return',
  navLabel: 'Net Return',
  icon: Calculator,
  owner: 'Member 2',
  stepNumber: 4,
  component: NetReturnPage,
  description: 'Calculate net earnings after subtracting transport, loading, and market cess.',
};

export default netReturnModule;
