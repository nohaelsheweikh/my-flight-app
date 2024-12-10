
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
};

export const getNearbyAirports = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/flights/getNearByAirports`, {
      headers,
      params: { lat: latitude, lng: longitude, locale: 'en-US' },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching nearby airports');
  }
};

export const searchAirport = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/flights/searchAirport`, {
      headers,
      params: { query, locale: 'en-US' },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error searching airports');
  }
};

export const searchFlights = async (data) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v2/flights/searchFlights`, {
        headers,
        params: {
          originSkyId: data.origin.skyId,
          destinationSkyId: data.destination.skyId,
          originEntityId: data.origin.entityId,
          destinationEntityId: data.destination.entityId,
          date: data.date, // Pass the selected date from the form
          cabinClass: data.cabinClass,
          adults: data.adults,
          sortBy: 'best',
          currency: 'USD',
          market: 'en-US',
          countryCode: 'US', // Optional, update as needed
        },
      });
      return response.data; // Return the flight data
    } catch (error) {
      console.error('Error searching flights:', error);
      throw new Error('Error fetching flights');
    }
  };
  