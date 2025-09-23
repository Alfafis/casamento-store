import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import ConfirmPage from './pages/ConfirmPage';
import GiftPage from './pages/GiftPage';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

// const queryClient = new QueryClient();

const App = () => (
  // <QueryClientProvider client={queryClient}>
  // <TooltipProvider>
  // <Toaster />
  // <Sonner />
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lista-de-presentes" element={<GiftPage />} />
      <Route path="/confirmar-presenca" element={<ConfirmPage />} />
      <Route path="/sobre-o-evento" element={<AboutPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  // </TooltipProvider>
  // </QueryClientProvider>
);

export default App;
