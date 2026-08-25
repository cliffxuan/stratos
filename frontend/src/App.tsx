import React, { useState, useEffect } from 'react';
import { TabId, TelemetryData, NewsItem, HardwareProfile, PowerMarketHub } from './types';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { OverviewTab } from './components/OverviewTab';
import { TimelineTab } from './components/TimelineTab';
import { ThermodynamicsTab } from './components/ThermodynamicsTab';
import { OrbitalSimulatorTab } from './components/OrbitalSimulatorTab';
import { EcosystemTab } from './components/EcosystemTab';
import { EconomicsTab } from './components/EconomicsTab';
import { ChallengesTab } from './components/ChallengesTab';
import { MediaTab } from './components/MediaTab';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('summary');
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [timeline, setTimeline] = useState<NewsItem[]>([]);
  const [powerMarkets, setPowerMarkets] = useState<PowerMarketHub[]>([]);
  const [hardwareProfiles, setHardwareProfiles] = useState<HardwareProfile[]>([]);

  useEffect(() => {
    // Fetch live telemetry from FastAPI backend
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
        }
      } catch (err) {
        console.warn('Backend telemetry fetch skipped, using default client metrics', err);
      }
    };

    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          setTimeline(data.timeline || []);
        }
      } catch (err) {
        console.warn('Backend news fetch skipped', err);
      }
    };

    const fetchHardware = async () => {
      try {
        const res = await fetch('/api/hardware');
        if (res.ok) {
          const data = await res.json();
          setHardwareProfiles(data.hardware || []);
        }
      } catch (err) {
        console.warn('Backend hardware fetch skipped', err);
      }
    };

    const fetchPowerGrid = async () => {
      try {
        const res = await fetch('/api/power-grid');
        if (res.ok) {
          const data = await res.json();
          setPowerMarkets(data.power_markets || []);
        }
      } catch (err) {
        console.warn('Backend power-grid fetch skipped', err);
      }
    };

    fetchTelemetry();
    fetchNews();
    fetchHardware();
    fetchPowerGrid();

    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#070a13] text-slate-100">
      <LiveTicker telemetry={telemetry} />
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentTab === 'summary' && <OverviewTab onSelectTab={setCurrentTab} />}
        {currentTab === 'timeline' && <TimelineTab timeline={timeline} />}
        {currentTab === 'energy' && (
          <ThermodynamicsTab powerMarkets={powerMarkets} hardwareProfiles={hardwareProfiles} />
        )}
        {currentTab === 'orbital' && <OrbitalSimulatorTab />}
        {currentTab === 'players' && <EcosystemTab />}
        {currentTab === 'economics' && <EconomicsTab />}
        {currentTab === 'challenges' && <ChallengesTab />}
        {currentTab === 'media' && <MediaTab />}
      </main>

      <Footer />
    </div>
  );
};

export default App;
