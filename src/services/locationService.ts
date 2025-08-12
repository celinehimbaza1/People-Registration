import axios from 'axios';

const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
const BASE_URL = 'https://rwanda.p.rapidapi.com';

const headers = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'rwanda.p.rapidapi.com',
};

const apiRequest = async (endpoint: string, params: object = {}) => {
  if (!API_KEY) {
    console.error("🔴 CRITICAL: API Key is missing.");
    return [];
  }
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, { 
      headers: headers,
      params: params
    });
    // The actual data is inside response.data.data
    return response.data.data || [];
  } catch (error: any) {
    console.error(`❌ API request failed for endpoint: ${endpoint} with params ${JSON.stringify(params)}`);
    console.error("Error details:", error.response?.data || error.message);
    return []; 
  }
};

// --- FINAL, CORRECTED, AND WORKING API FUNCTIONS ---

/**
 * Fetches only the districts from Kigali province.
 * API Parameter: 'p' for province.
 */
export const fetchDistricts = () => apiRequest("/districts", { p: "Kigali" });

/**
 * Fetches sectors for a given district, ensuring it's scoped to Kigali.
 * API Parameters: 'p' for province and 'd' for district.
 */
export const fetchSectors = (district: string) => {
  if (!district) return Promise.resolve([]);
  return apiRequest('/sectors', { p: "Kigali", d: district });
};

/**
 * Fetches cells for a given sector AND district.
 * API Parameters: 'p', 'd', and 'se' for sector.
 */
export const fetchCells = (district: string, sector: string) => {
  if (!district || !sector) return Promise.resolve([]);
  return apiRequest('/cells', { p: "Kigali", d: district, se: sector });
};

/**
 * Fetches villages for a given cell, sector, AND district.
 * API Parameters: 'p', 'd', 'se', and 'ce' for cell.
 */
export const fetchVillages = (district: string, sector: string, cell: string) => {
  if (!district || !sector || !cell) return Promise.resolve([]);
  return apiRequest('/villages', { p: "Kigali", d: district, se: sector, ce: cell });
};