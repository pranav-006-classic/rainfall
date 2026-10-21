'use client';

import React, { useState } from 'react';
import DatePicker from '@/components/DatePicker';
import LayerToggle from '@/components/LayerToggle';
import RegimeBadge from '@/components/RegimeBadge';
import MapView from '@/components/MapView';
import Legend from '@/components/Legend';
import DistrictCard from '@/components/DistrictCard';
import DistrictTable from '@/components/DistrictTable';
import {
  DATE_BOUNDS,
  RainfallLayer,
  getDailyForecast,
  getCombinedDistrictData,
} from '@/lib/data';

export default function DashboardPage() {
  // Shared state maintained in app/page.tsx and passed down as props (Task Guide requirement)
  const [selectedDate, setSelectedDate] = useState<string>(DATE_BOUNDS.defaultDate);
  const [selectedLayer, setSelectedLayer] = useState<RainfallLayer>('corrected');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | undefined>('mumbai');

  // Read data via lib/data.ts wrapper
  const dailyForecast = getDailyForecast(selectedDate);
  const combinedDistricts = getCombinedDistrictData(selectedDate);
  const hasData = dailyForecast !== null && combinedDistricts.length > 0;

  // Layer display names
  const layerLabels: Record<RainfallLayer, string> = {
    raw: 'Raw',
    corrected: 'Corrected',
    observed: 'Observed',
  };

  // Top summary districts for priority cards
  // Display the top 4 places by rainfall amount for the selected layer
  const topSummaryDistricts = [...combinedDistricts]
    .sort((a, b) => b.rainfall[selectedLayer] - a.rainfall[selectedLayer])
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F8FB] text-slate-800 flex flex-col antialiased">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight truncate">
                  Rainfall Forecast
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium truncate">
                SIH26080 • IMD / MOSDAC / Open-Meteo Precision Telemetry
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
              <span>Person A: Map &amp; Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* 
          DASHBOARD SECTIONS ORDER (Task Guide Specification):
          1. Date picker
          2. Layer buttons
          3. Monsoon-regime label
          4. Map
          5. Legend
          6. Summary cards
          7. District table near the bottom
        */}

        {/* 1, 2, 3: Controls Header Section (Date Picker, Regime Badge, Layer Buttons) */}
        <section
          aria-label="Dashboard Controls"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col gap-4"
        >
          {/* Top Row: Date Picker & Monsoon Regime Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* 1. Date Picker */}
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={(newDate) => setSelectedDate(newDate)}
              hasData={hasData}
            />

            {/* 3. Monsoon-regime label */}
            <div className="flex items-center self-start sm:self-center">
              <RegimeBadge regime={dailyForecast?.regime ?? 'Normal'} />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* 2. Layer Toggle Buttons */}
          <div className="max-w-md">
            <LayerToggle
              selectedLayer={selectedLayer}
              onLayerChange={(layer) => setSelectedLayer(layer)}
            />
          </div>
        </section>

        {/* 4. Map Section */}
        <section aria-label="Interactive Map View">
          <MapView
            districts={combinedDistricts}
            selectedLayer={selectedLayer}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={(id) => setSelectedDistrictId(id)}
          />
        </section>

        {/* 5. Legend Section (Matches Map Exactly via lib/rainfallScale.ts) */}
        <section aria-label="Rainfall Classification Legend">
          <Legend />
        </section>

        {/* 6. Summary Cards (DistrictCard instances) */}
        <section aria-label="Key District Summaries" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Priority District Telemetry
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Top Active Gauges ({layerLabels[selectedLayer]} View)
            </span>
          </div>

          {topSummaryDistricts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
              No priority district data available for this date.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {topSummaryDistricts.map((item) => (
                <DistrictCard
                  key={item.id}
                  name={item.name}
                  rainfall={item.rainfall[selectedLayer]}
                  layerLabel={layerLabels[selectedLayer]}
                  state={item.state}
                  division={item.division}
                  biasAdjustment={item.rainfall.corrected - item.rainfall.raw}
                  onClick={() => setSelectedDistrictId(item.id)}
                  className={selectedDistrictId === item.id ? 'ring-2 ring-blue-600' : ''}
                />
              ))}
            </div>
          )}
        </section>

        {/* 7. District Table near the bottom (Person B Component) */}
        <section aria-label="Full District Telemetry Table">
          <DistrictTable
            districts={combinedDistricts}
            selectedLayer={selectedLayer}
            onSelectDistrict={(id) => setSelectedDistrictId(id)}
          />
        </section>

        {/* Pipeline Readiness Architecture Callout */}
        <section
          aria-label="Architecture Status"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-600 text-xs"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>
              <strong>Data Access Architecture:</strong> Components read exclusively through <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-mono">lib/data.ts</code>. A future swap to FastAPI is a single-file change.
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            FastAPI Ready
          </span>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SIH26080 — Rainfall Forecast Visualization Frontend</span>
          <span>Person A Work: Map &amp; Dashboard • Person B Work: Table, Charts &amp; Supporting Pages</span>
        </div>
      </footer>
    </div>
  );
}
