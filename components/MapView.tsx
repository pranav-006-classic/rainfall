'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { DistrictCombinedData, RainfallLayer } from '@/lib/data';

export interface MapViewProps {
  districts: DistrictCombinedData[];
  selectedLayer: RainfallLayer;
  selectedDistrictId?: string;
  onSelectDistrict?: (id: string) => void;
  className?: string;
}

// Dynamically import Leaflet with SSR disabled (Task Guide requirement)
const DynamicMap = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Loading Subcontinent Rainfall Telemetry Map"
      className="relative w-full h-[460px] bg-slate-100 rounded-xl flex flex-col items-center justify-center border border-slate-200 overflow-hidden"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">Loading Geospatial Telemetry Map...</p>
          <p className="text-xs text-slate-400">OpenStreetMap Subcontinent Vector Layer (EPSG:4326)</p>
        </div>
      </div>
    </div>
  ),
});

export default function MapView({
  districts,
  selectedLayer,
  selectedDistrictId,
  onSelectDistrict,
  className = '',
}: MapViewProps) {
  return (
    <section
      aria-label="Rainfall Forecast Map"
      className={`flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden ${className}`}
    >
      {/* Map Control / Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            Subcontinent Telemetry Map
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
            EPSG:4326
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Interactive OSM</span>
          </span>
        </div>
      </div>

      {/* Dynamic Map Component */}
      <div className="p-2 bg-slate-50/50">
        <DynamicMap
          districts={districts}
          selectedLayer={selectedLayer}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={onSelectDistrict}
        />
      </div>
    </section>
  );
}
