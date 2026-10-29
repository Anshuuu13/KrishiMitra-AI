import { Users } from 'lucide-react';
import BuyerMatchingPage from './BuyerMatchingPage';

export const buyerMatchingModule = {
  id: 'buyer-matching',
  name: 'Buyer Matching',
  hindiName: 'खरीदार खोज',
  path: '/buyer-matching',
  navLabel: 'Buyer Matching',
  icon: Users,
  owner: 'Member 2',
  stepNumber: 3,
  component: BuyerMatchingPage,
  description: 'Connect with bulk buyers, flour mills, and retailers with upfront pricing.',
};

export default buyerMatchingModule;
