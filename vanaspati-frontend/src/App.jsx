import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageWrapper from './components/layout/PageWrapper';
import FloatingChatWidget from './components/common/FloatingChatWidget';

const HomePage = lazy(() => import('./pages/HomePage'));
const PlantsPage = lazy(() => import('./pages/PlantsPage'));
const PlantDetailPage = lazy(() => import('./pages/PlantDetailPage'));
const GardenMapPage = lazy(() => import('./pages/GardenMapPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const RemediesPage = lazy(() => import('./pages/RemediesPage'));
const RemedyDetailPage = lazy(() => import('./pages/RemedyDetailPage'));
const SeasonalCalendarPage = lazy(() => import('./pages/SeasonalCalendarPage'));
const PlantQuizPage = lazy(() => import('./pages/PlantQuizPage'));
const AilmentsPage = lazy(() => import('./pages/AilmentsPage'));
const AilmentDetailPage = lazy(() => import('./pages/AilmentDetailPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminQuizPage = lazy(() => import('./pages/AdminQuizPage'));
const AdminRemedyPage = lazy(() => import('./pages/AdminRemedyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Suspense fallback={<main><p>Loading Vanaspati...</p></main>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/plants" element={<PageWrapper><PlantsPage /></PageWrapper>} />
            <Route path="/plants/:id/:slug" element={<PageWrapper><PlantDetailPage /></PageWrapper>} />
            <Route path="/garden" element={<PageWrapper><GardenMapPage /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
            <Route path="/quiz" element={<PageWrapper><QuizPage /></PageWrapper>} />
            <Route path="/compare" element={<PageWrapper><ComparePage /></PageWrapper>} />
            <Route path="/remedies" element={<PageWrapper><RemediesPage /></PageWrapper>} />
            <Route path="/remedies/:id" element={<PageWrapper><RemedyDetailPage /></PageWrapper>} />
            <Route path="/seasonal-calendar" element={<PageWrapper><SeasonalCalendarPage /></PageWrapper>} />
            <Route path="/plant-quiz" element={<PageWrapper><PlantQuizPage /></PageWrapper>} />
            <Route path="/ailments" element={<PageWrapper><AilmentsPage /></PageWrapper>} />
            <Route path="/ailments/:id" element={<PageWrapper><AilmentDetailPage /></PageWrapper>} />
            <Route path="/learn" element={<PageWrapper><LearnPage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
            <Route path="/admin/quiz" element={<PageWrapper><AdminQuizPage /></PageWrapper>} />
            <Route path="/admin/remedies" element={<PageWrapper><AdminRemedyPage /></PageWrapper>} />
            <Route path="/500" element={<PageWrapper><ErrorPage /></PageWrapper>} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <FloatingChatWidget />
      <Footer />
    </>
  );
}
