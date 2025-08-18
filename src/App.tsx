import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SmartNavProvider } from "@/context/SmartNavContext";
import { DataPersistenceProvider } from "@/context/DataPersistenceContext";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SmartNavProvider>
      <DataPersistenceProvider>
        <>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </>
      </DataPersistenceProvider>
    </SmartNavProvider>
  </QueryClientProvider>
);

export default App;
