import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '../shared/i18n/LanguageContext';
import Layout from './Layout';
import HomePage from './HomePage';
import DashboardPage from './DashboardPage';
import { ALL_MODULES } from './moduleRegistry';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Dynamically register all 7 modules from the registry */}
            {ALL_MODULES.map((module) => {
              const Component = module.component;
              const routePath = module.path.replace(/^\//, ''); // e.g. "crop-doctor"
              return (
                <Route
                  key={module.id}
                  path={routePath}
                  element={<Component />}
                />
              );
            })}

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
