import { Stethoscope } from 'lucide-react';
import CropDoctorPage from './CropDoctorPage';

export const cropDoctorModule = {
  id: 'crop-doctor',
  name: 'Crop Doctor',
  hindiName: 'फसल डॉक्टर',
  path: '/crop-doctor',
  navLabel: 'Crop Doctor',
  icon: Stethoscope,
  owner: 'Member 3',
  stepNumber: 1,
  component: CropDoctorPage,
  description: 'Upload crop photos and assess symptoms with simulated agricultural guidance.',
};

export default cropDoctorModule;
