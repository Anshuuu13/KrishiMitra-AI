import { Truck } from 'lucide-react';
import LogisticsPage from './LogisticsPage';

export const logisticsModule = {
  id: 'logistics',
  name: 'Logistics Support',
  hindiName: 'परिवहन व लॉजिस्टिक्स',
  path: '/logistics',
  navLabel: 'Logistics',
  icon: Truck,
  owner: 'Member 3',
  stepNumber: 6,
  component: LogisticsPage,
  description: 'Find local transport options and estimate freight costs based on distance.',
};

export default logisticsModule;
