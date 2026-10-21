'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DistrictCombinedData, RainfallLayer } from '@/lib/data';
import { getRainfallBracket } from '@/lib/rainfallScale';

interface DistrictTableProps {
  districts: DistrictCombinedData[];
  selectedLayer?: RainfallLayer;
  onSelectDistrict?: (id: string) => void;
  className?: string;
}

type SortField = 'name' | 'raw' | 'corrected' | 'observed' | 'heavyRainProb';
type SortOrder = 'asc' | 'desc';

export default function DistrictTable({
  districts,
  selectedLayer = 'corrected',
  onSelectDistrict,
  className = '',
}: DistrictTableProps) {
  const [sortField, setSortField] = useState<SortField>('corrected');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedDistricts = [...districts].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    if (sortField === 'name') {
      aVal = a.name;
      bVal = b.name;
      return sortOrder === 'asc'
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    } else if (sortField === 'raw') {
      aVal = a.rainfall.raw;
      bVal = b.rainfall.raw;
    } else if (sortField === 'corrected') {
      aVal = a.rainfall.corrected;
      bVal = b.rainfall.corrected;
    } else if (sortField === 'observed') {
      aVal = a.rainfall.observed;
      bVal = b.rainfall.observed;
    } else if (sortField === 'heavyRainProb') {
      aVal = a.rainfall.heavyRainProb;
      bVal = b.rainfall.heavyRainProb;
    }

    return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  return (
    <section
      aria-label="District Telemetry Table Integration Area"
      className={`flex flex-col bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-base font-bold text-slate-900">
            District Telemetry Matrix
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200/60">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Person B Integration Component: <code>components/DistrictTable.tsx</code></span>
        </div>
      </div>

      <div className="w-full mt-3 rounded-xl bg-slate-50/80 p-2 overflow-x-auto border border-slate-200/70">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="bg-slate-200/70 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <th
                onClick={() => handleSort('name')}
                className="py-2.5 px-3 rounded-l-lg cursor-pointer hover:bg-slate-300/60 select-none"
              >
                District {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-2.5 px-3">State</th>
              <th
                onClick={() => handleSort('raw')}
                className={`py-2.5 px-3 cursor-pointer hover:bg-slate-300/60 select-none ${
                  selectedLayer === 'raw' ? 'bg-blue-100/60 text-blue-900 font-bold' : ''
                }`}
              >
                Raw (mm) {sortField === 'raw' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('corrected')}
                className={`py-2.5 px-3 cursor-pointer hover:bg-slate-300/60 select-none ${
                  selectedLayer === 'corrected' ? 'bg-blue-100/60 text-blue-900 font-bold' : ''
                }`}
              >
                Corrected (mm) {sortField === 'corrected' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('observed')}
                className={`py-2.5 px-3 cursor-pointer hover:bg-slate-300/60 select-none ${
                  selectedLayer === 'observed' ? 'bg-blue-100/60 text-blue-900 font-bold' : ''
                }`}
              >
                Observed (mm) {sortField === 'observed' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('heavyRainProb')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-300/60 select-none"
              >
                Alert Prob {sortField === 'heavyRainProb' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-2.5 px-3 rounded-r-lg text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sortedDistricts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No district data available for this date.
                </td>
              </tr>
            ) : (
              sortedDistricts.map((item) => {
                const bracket = getRainfallBracket(item.rainfall[selectedLayer]);
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectDistrict?.(item.id)}
                    className="hover:bg-white transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: bracket.color }}
                        aria-hidden="true"
                      />
                      <span className="group-hover:text-blue-700 transition-colors">
                        {item.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-xs">
                      {item.state}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {item.rainfall.raw.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                      {item.rainfall.corrected.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {item.rainfall.observed.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold font-mono"
                        style={{
                          backgroundColor:
                            item.rainfall.heavyRainProb >= 70
                              ? '#FEE2E2'
                              : item.rainfall.heavyRainProb >= 40
                              ? '#FEF3C7'
                              : '#EFF6FF',
                          color:
                            item.rainfall.heavyRainProb >= 70
                              ? '#B91C1C'
                              : item.rainfall.heavyRainProb >= 40
                              ? '#B45309'
                              : '#1D4ED8',
                        }}
                      >
                        {item.rainfall.heavyRainProb}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/district/${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        <span>Details</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
