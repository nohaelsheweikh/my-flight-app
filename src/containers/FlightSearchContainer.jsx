import React, { useState, useRef } from 'react';
import { searchAirport, searchFlights } from '../services/api';
import FlightSearchForm from '../components/flights/FlightSearchForm';
import FlightResults from '../components/flights/FlightResults';
import Notification from '../components/common/Notification';

const FlightSearchContainer = ({ origin, onBack }) => {
  const [destination, setDestination] = useState('');
  const [dropdownResults, setDropdownResults] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [adults, setAdults] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const typingTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // State for managing notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  const handleDestinationChange = (query) => {
    if (selectedDestination && query !== destination) {
      setSelectedDestination(null);
    }
    setDestination(query);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (!query) {
      setDropdownResults([]);
      return;
    }

    typingTimeoutRef.current = setTimeout(async () => {
      setDestinationLoading(true);
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await searchAirport(query, { signal: controller.signal });
        if (response && response.data) {
          const formattedResults = response.data
            .filter(
              (item) =>
                item.navigation?.relevantFlightParams?.skyId &&
                item.navigation?.relevantFlightParams?.entityId
            )
            .map((item) => ({
              name: item.presentation?.title || item.name,
              skyId: item.navigation.relevantFlightParams.skyId,
              entityId: item.navigation.relevantFlightParams.entityId,
            }));
          setDropdownResults(formattedResults);
        } else {
          setDropdownResults([]);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setNotification({
            open: true,
            message: 'Error searching destination.',
            severity: 'error',
          });
          setDropdownResults([]);
        }
      } finally {
        setDestinationLoading(false);
        abortControllerRef.current = null;
      }
    }, 500);
  };

  const handleDestinationSelect = (dest) => {
    if (!dest.skyId || !dest.entityId) {
      setNotification({
        open: true,
        message: 'Selected destination does not have valid identifiers.',
        severity: 'warning',
      });
      return;
    }
    setSelectedDestination(dest);
    setDropdownResults([]);
    setDestination(dest.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDestination) {
      setNotification({
        open: true,
        message: 'Please select a valid destination.',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const flightData = {
        origin,
        destination: selectedDestination,
        date: travelDate,
        adults,
        cabinClass,
      };

      const response = await searchFlights(flightData);
      const itineraries = response?.data?.itineraries || [];
      setResults(itineraries);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error searching flights.',
        severity: 'error',
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <FlightSearchForm
        origin={origin}
        onBack={onBack}
        destination={destination}
        destinationLoading={destinationLoading}
        dropdownResults={dropdownResults}
        selectedDestination={selectedDestination}
        travelDate={travelDate}
        adults={adults}
        cabinClass={cabinClass}
        loading={loading}
        onDestinationChange={handleDestinationChange}
        onDestinationSelect={handleDestinationSelect}
        onDateChange={setTravelDate}
        onAdultsChange={setAdults}
        onCabinClassChange={setCabinClass}
        onSubmit={handleSubmit}
      />

      <div style={{ marginTop: '20px' }}>
        <FlightResults results={results} />
      </div>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </div>
  );
};

export default FlightSearchContainer;
