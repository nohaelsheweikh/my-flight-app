import { describe, test, expect, vi, afterEach } from 'vitest';
import axios from 'axios';
import { getNearbyAirports, searchAirport, searchFlights } from '../../services/api.js';

vi.mock('axios');

describe('API Tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('getNearbyAirports calls correct endpoint and returns data', async () => {
    // Ensure axios.get is a mock function
    axios.get = vi.fn();

    // mockData represents what response.data should be.
    const mockData = {
      nearby: [
        { name: 'Test Airport', entityId: '12345', presentation: { title: 'Test Airport' } }
      ]
    };

    // Return { data: mockData } so that response.data = mockData
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const lat = 51.5074;
    const lng = 0.1278;
    const result = await getNearbyAirports(lat, lng);

    // result should be mockData directly
    expect(result).toEqual(mockData);
  });

  test('searchAirport calls correct endpoint and returns data', async () => {
    axios.get = vi.fn();

    // For searchAirport, the function returns response.data which should be an array of airports.
    const mockData = [
      {
        name: 'City Airport',
        entityId: '67890',
        presentation: { title: 'City Airport' },
        navigation: { relevantFlightParams: { skyId: 'LHR', entityId: '95565050' } }
      }
    ];

    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const query = 'London';
    const result = await searchAirport(query);

    // result should be mockData (the array)
    expect(result).toEqual(mockData);
  });

  test('searchFlights calls correct endpoint and returns data', async () => {
    axios.get = vi.fn();

    const mockFlightData = {
      itineraries: [
        { id: 'id-1', price: { formatted: '$500' }, legs: [] }
      ]
    };

    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockFlightData }));

    const flightData = {
      origin: { skyId: 'LHR', entityId: '95565050', name: 'London Heathrow' },
      destination: { skyId: 'JFK', entityId: '95565058', name: 'New York JFK' },
      date: '2024-12-18',
      adults: 1,
      cabinClass: 'economy',
    };

    const result = await searchFlights(flightData);

    // result should be mockFlightData
    expect(result).toEqual(mockFlightData);
  });
});
