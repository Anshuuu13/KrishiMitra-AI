import { MessageSquare } from 'lucide-react';
import HindiAssistantPage from './HindiAssistantPage';

export const hindiAssistantModule = {
  id: 'hindi-assistant',
  name: 'Hindi Assistant',
  hindiName: 'हिंदी कृषि सहायक',
  path: '/hindi-assistant',
  navLabel: 'Hindi Assistant',
  icon: MessageSquare,
  owner: 'Member 3',
  stepNumber: 7,
  component: HindiAssistantPage,
  description: 'Instant answers to common farming, pest, and crop marketing queries in Hindi.',
};

export default hindiAssistantModule;
