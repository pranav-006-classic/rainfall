/**
 * Data Access Layer (Wrapper)
 * 
 * All components read data through this file.
 * To connect to a live FastAPI backend in the future, only this file needs to be updated
 * with fetch() calls to the FastAPI endpoints.
 */

import {
  DISTRICTS,
  MOCK_FORECASTS,
  type DailyForecastData,
  type DistrictInfo,
  type DistrictRainfallData,
  type MonsoonRegime,
  type RainfallLayer,
} from './mockData';

export type {
  DailyForecastData,
  DistrictInfo,
  DistrictRainfallData,
  MonsoonRegime,
  RainfallLayer,
};

export interface DistrictCombinedData extends DistrictInfo {
  rainfall: DistrictRainfallData;
}

export const DATE_BOUNDS = {
  min: '2024-06-01',
  max: '2025-09-30',
  defaultDate: '2024-07-15',
};

/**
 * Get daily forecast metadata and all district records for a specific date.
 * Returns null if no data is available for that date.
 */
export function getDailyForecast(date: string): DailyForecastData | null {
  return MOCK_FORECASTS[date] || null;
}

/**
 * Returns all registered districts/places.
 */
export function getAllDistricts(): DistrictInfo[] {
  return DISTRICTS;
}

/**
 * Returns info for a specific district.
 */
export function getDistrictById(id: string): DistrictInfo | undefined {
  return DISTRICTS.find((d) => d.id === id);
}

/**
 * Returns merged district metadata and rainfall values for a selected date.
 * If no data exists for the date, returns empty array.
 */
export function getCombinedDistrictData(date: string): DistrictCombinedData[] {
  const forecast = getDailyForecast(date);
  if (!forecast) return [];

  return forecast.districts
    .map((rainfallItem) => {
      const info = getDistrictById(rainfallItem.districtId);
      if (!info) return null;
      return {
        ...info,
        rainfall: rainfallItem,
      };
    })
    .filter((item): item is DistrictCombinedData => item !== null);
}
