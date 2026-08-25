import React, { useState, useEffect } from 'react';
import { TabId, TelemetryData, NewsItem, HardwareProfile, PowerMarketHub, SatelliteNode, LaserCrosslink } from './types';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { OverviewTab } from './components/OverviewTab';
import { ConstellationTrackerTab } from './components/ConstellationTrackerTab';
import { PowerArbitrageTab } from './components/PowerArbitrageTab';
import { HardwareMatrixTab } from './components/HardwareMatrixTab';
import { TimelineTab } from './components/TimelineTab';
import { ThermodynamicsTab } from './components/ThermodynamicsTab';
import { EconomicsTab } from './components/EconomicsTab';
import { ChallengesTab } from './components/ChallengesTab';
import { MediaTab } from './components/MediaTab';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('summary');
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [satellites, setSatellites] = useState<SatelliteNode[]>([]);
  const [crosslinks, setCrosslinks] = useState<LaserCrosslink[]>([]);
  const [timeline, setTimeline] = useState<NewsItem[]>([]);
  const [powerMarkets, setPowerMarkets] = useState<PowerMarketHub[]>([]);
  const [hardwareProfiles, setHardwareProfiles] = useState<HardwareProfile[]>([]);

  useEffect(() => {
    // 1. Fetch live NOAA space weather telemetry
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
        }
      } catch (err) {
        console.warn('Telemetry fetch error:', err);
      }
    };

    // 2. Fetch live satellite orbit coordinates
    const fetchSatellites = async () => {
      try {
        const res = await fetch('/api/satellites');
        if (res.ok) {
          const data = await res.json();
          setSatellites(data.satellites || []);
        }
      } catch (err) {
        console.warn('Satellites fetch error:', err);
      }
    };

    // 3. Fetch dynamic laser crosslinks
    const fetchCrosslinks = async () => {
      try {
        const res = await fetch('/api/laser-mesh');
        if (res.ok) {
          const data = await res.json();
          setCrosslinks(data.crosslinks || []);
        }
      } catch (err) {
        console.warn('Laser mesh fetch error:', err);
      }
    };

    // 4. Fetch power markets
    const fetchPowerGrid = async () => {
      try {
        const res = await fetch('/api/power-grid');
        if (res.ok) {
          const data = await res.json();
          setPowerMarkets(data.power_markets || []);
        }
      } catch (err) {
        console.warn('Power grid fetch error:', err);
      }
    };

    // 5. Fetch silicon database
    const fetchHardware = async () => {
      try {
        const res = await fetch('/api/hardware');
        if (res.ok) {
          const data = await res.json();
          setHardwareProfiles(data.hardware || []);
        }
      } catch (err) {
        console.warn('Hardware fetch error:', err);
      }
    };

    // 6. Fetch news timeline
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          setTimeline(data.timeline || []);
        }
      } catch (err) {
        console.warn('News timeline fetch error:', err);
      }
    };

    fetchTelemetry();
    fetchSatellites();
    fetchCrosslinks();
    fetchPowerGrid();
    fetchHardware();
    fetchNews();

    // Fast polling for orbital positions (every 4 seconds) and NOAA weather (every 30 seconds)
    const orbitInterval = setInterval(() => {
      fetchSatellites();
      fetchCrosslinks();
    }, 4000);

    const weatherInterval = setInterval(fetchTelemetry, 30000);

    return () => {
      clearInterval(orbitInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#070a13] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <LiveTicker telemetry={telemetry} />
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentTab === 'summary' && <OverviewTab onSelectTab={setCurrentTab} />}
        {currentTab === 'tracking' && (
          <ConstellationTrackerTab satellites={satellites} crosslinks={crosslinks} />
        )}
        {currentTab === 'arbitrage' && (
          <PowerArbitrageTab powerMarkets={powerMarkets} />
        )}
        {currentTab === 'hardware' && (
          <HardwareMatrixTab hardware={hardwareProfiles} />
        )}
        {currentTab === 'timeline' && <TimelineTab timeline={timeline} />}
        {currentTab === 'energy' && (
          <ThermodynamicsTab powerMarkets={powerMarkets} hardwareProfiles={hardwareProfiles} />
        )}
        {currentTab === 'economics' && <EconomicsTab />}
        {currentTab === 'challenges' && <ChallengesTab />}
        {currentTab === 'media' && <MediaTab />}
      </main>

      <Footer />
    </div>
  );
};

export default App;
