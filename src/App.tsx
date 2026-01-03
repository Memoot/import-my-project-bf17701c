import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdvertisementsPage from "./pages/AdvertisementsPage";
import BlogPage from "./pages/BlogPage";
import CreateAdminPage from "./pages/CreateAdminPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/dashboard/CampaignsPage";
import SubscribersManagementPage from "./pages/dashboard/SubscribersManagementPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import SentPage from "./pages/dashboard/SentPage";
import InboxPage from "./pages/dashboard/InboxPage";
import TemplatesPage from "./pages/dashboard/TemplatesPage";
import NewCampaignPage from "./pages/dashboard/NewCampaignPage";
import LandingPagesPage from "./pages/dashboard/LandingPagesPage";
import LandingPageTemplatesPage from "./pages/dashboard/LandingPageTemplatesPage";
import LandingPageEditorPage from "./pages/dashboard/LandingPageEditorPage";
import LandingPagePreviewPage from "./pages/dashboard/LandingPagePreviewPage";
import TemplateImagesPage from "./pages/dashboard/TemplateImagesPage";
import AdminPage from "./pages/dashboard/AdminPage";
import AdminTemplatesPage from "./pages/dashboard/AdminTemplatesPage";
import UploadTemplatesPage from "./pages/dashboard/UploadTemplatesPage";
import AIImageGeneratorPage from "./pages/dashboard/AIImageGeneratorPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import UsersManagementPage from "./pages/dashboard/UsersManagementPage";
import AdsManagementPage from "./pages/dashboard/AdsManagementPage";
import AdsReportsPage from "./pages/dashboard/AdsReportsPage";
import PlansManagementPage from "./pages/dashboard/PlansManagementPage";
import SubscriptionsManagementPage from "./pages/dashboard/SubscriptionsManagementPage";
import PricingPage from "./pages/dashboard/PricingPage";
import ApiKeysManagementPage from "./pages/dashboard/ApiKeysManagementPage";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/advertisements" element={<AdvertisementsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/create-admin" element={<CreateAdminPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
          <Route path="/dashboard/campaigns/new" element={<ProtectedRoute><NewCampaignPage /></ProtectedRoute>} />
          <Route path="/dashboard/subscribers" element={<ProtectedRoute><SubscribersManagementPage /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/sent" element={<ProtectedRoute><SentPage /></ProtectedRoute>} />
          <Route path="/dashboard/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
          <Route path="/dashboard/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
          <Route path="/dashboard/landing-pages" element={<ProtectedRoute><LandingPagesPage /></ProtectedRoute>} />
          <Route path="/dashboard/landing-pages/templates" element={<ProtectedRoute><LandingPageTemplatesPage /></ProtectedRoute>} />
          <Route path="/dashboard/landing-pages/new" element={<ProtectedRoute><LandingPageEditorPage /></ProtectedRoute>} />
          <Route path="/dashboard/landing-pages/edit/:id" element={<ProtectedRoute><LandingPageEditorPage /></ProtectedRoute>} />
          <Route path="/dashboard/landing-pages/preview/:id" element={<ProtectedRoute><LandingPagePreviewPage /></ProtectedRoute>} />
          <Route path="/dashboard/landing-pages/template-images" element={<ProtectedRoute><TemplateImagesPage /></ProtectedRoute>} />
          <Route path="/dashboard/ai-images" element={<ProtectedRoute><AIImageGeneratorPage /></ProtectedRoute>} />
          <Route path="/dashboard/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/dashboard/admin/templates" element={<AdminRoute><AdminTemplatesPage /></AdminRoute>} />
          <Route path="/dashboard/admin/upload-templates" element={<AdminRoute><UploadTemplatesPage /></AdminRoute>} />
          <Route path="/dashboard/admin/users" element={<AdminRoute><UsersManagementPage /></AdminRoute>} />
          <Route path="/dashboard/admin/ads" element={<AdminRoute><AdsManagementPage /></AdminRoute>} />
          <Route path="/dashboard/admin/ads-reports" element={<AdminRoute><AdsReportsPage /></AdminRoute>} />
          <Route path="/dashboard/admin/plans" element={<AdminRoute><PlansManagementPage /></AdminRoute>} />
          <Route path="/dashboard/admin/subscriptions" element={<AdminRoute><SubscriptionsManagementPage /></AdminRoute>} />
          <Route path="/dashboard/admin/api-keys" element={<AdminRoute><ApiKeysManagementPage /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
