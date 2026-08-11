import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LandingPage } from "@/pages/LandingPage";
import { AnalysisPage } from "@/pages/AnalysisPage";
import { ReportPage } from "@/pages/ReportPage";
import { AuthPage } from "@/pages/AuthPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/analysis/:jobId" element={<AnalysisPage />} />
          <Route path="/report/:jobId" element={<ReportPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
