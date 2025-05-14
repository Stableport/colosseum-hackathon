
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SendMoneyFlow from "./components/Transfers/SendMoneyFlow";
import TransactionDetail from "./components/Transfers/TransactionDetail";
import AppLayout from "./components/Layout/AppLayout";
import Profile from "./pages/Profile";
import History from "./pages/History";
import CryptoExplainer from "./pages/CryptoExplainer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/send" element={
            <AppLayout showNav={true}>
              <SendMoneyFlow />
            </AppLayout>
          } />
          <Route path="/transaction/:id" element={
            <AppLayout showNav={true}>
              <TransactionDetail />
            </AppLayout>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/how-it-works" element={<CryptoExplainer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
