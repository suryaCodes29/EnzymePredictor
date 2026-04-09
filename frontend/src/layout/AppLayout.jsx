import { Outlet } from 'react-router-dom';

import Topbar from '../components/Topbar';

export default function AppLayout({ notify }) {
  return (
    <div className="min-h-screen bg-mesh px-3 py-3 md:px-4">
      <main className="mx-auto max-w-[1400px]">
        <div className="glass-panel min-h-[calc(100vh-1.5rem)] rounded-3xl p-4 md:p-6">
          <Topbar />
          <Outlet context={{ notify }} />
        </div>
      </main>
    </div>
  );
}
