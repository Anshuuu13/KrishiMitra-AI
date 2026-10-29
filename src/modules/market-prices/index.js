import { TrendingUp } from 'lucide-react';
import MarketPricesPage from './MarketPricesPage';

export const marketPricesModule = {
  id: 'market-prices',
  name: 'Smart Market Prices',
  hindiName: 'स्मार्ट मंडी भाव',
  path: '/market-prices',
  navLabel: 'Market Prices',
  icon: TrendingUp,
  owner: 'Member 2',
  stepNumber: 2,
  component: MarketPricesPage,
  description: 'Compare regional mandi rates to find fair market prices for your harvest.',
};

export default marketPricesModule;
