import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useAuthStore } from './stores/useAuthStore';
import { Navbar } from './components/Navbar';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TemplateMarketplace } from './components/marketplace/TemplateMarketplace';
import { TeamManagement } from './components/teams/TeamManagement';
import { UserReports } from './components/reports/UserReports';
import { WalletModal } from './components/wallet/WalletModal';
import { MatchCreatorModal } from './components/user/MatchCreatorModal';
import { AuthModal } from './components/auth/AuthModal';
import { OBSOverlayView } from './components/overlay/OBSOverlayView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'teams' | 'reports' | 'admin' | 'marketplace'>('dashboard');
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isCreateMatchOpen, setIsCreateMatchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // OBS Overlay Direct View Detection (/overlay/TOKEN)
  const path = window.location.pathname;
  if (path.startsWith('/overlay/')) {
    const token = path.split('/overlay/')[1];
    return <OBSOverlayView token={token} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenMarketplace={() => setActiveView('marketplace')}
        onOpenCreateMatch={() => setIsCreateMatchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'dashboard' && (
          <UserDashboard onOpenCreateMatch={() => setIsCreateMatchOpen(true)} />
        )}
        {activeView === 'teams' && <TeamManagement />}
        {activeView === 'reports' && <UserReports />}
        {activeView === 'marketplace' && (
          <TemplateMarketplace onOpenWallet={() => setIsWalletOpen(true)} />
        )}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
      <MatchCreatorModal isOpen={isCreateMatchOpen} onClose={() => setIsCreateMatchOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        Sports Overlay Hub &copy; {new Date().getFullYear()} - Professional Broadcast Scoreboards & OBS Graphics SaaS
      </footer>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
