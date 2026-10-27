import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './localization/LanguageContext';
import BaseLayout from './components/layout/BaseLayout';
import HomePage from './pages/HomePage';
import FlightsPage from './pages/FlightsPage';
import TripPlannerPage from './pages/TripPlannerPage';
import MilesAndPointsPage from './pages/MilesAndPointsPage';
import ResultsPage from './pages/ResultsPage';
import SignInPage from './pages/SignInPage';
import FoundationShowcase from './pages/FoundationShowcase';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <BaseLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/trip-planner" element={<TripPlannerPage />} />
            <Route path="/miles-and-points" element={<MilesAndPointsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/dev-showcase" element={<FoundationShowcase />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BaseLayout>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
