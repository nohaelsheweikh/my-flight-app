import React, { useState, useRef } from 'react';
import { searchAirport, searchFlights } from '../services/api';
import FlightSearchForm from '../components/flights/FlightSearchForm';
import FlightResults from '../components/flights/FlightResults';

const FlightSearchContainer = ({ origin, onBack }) => {
  // State to manage the destination input
  const [destination, setDestination] = useState('');

  // State to store the dropdown results for destination suggestions
  const [dropdownResults, setDropdownResults] = useState([]);

  // State to store the selected destination
  const [selectedDestination, setSelectedDestination] = useState(null);

  // State to store the number of adults traveling
  const [adults, setAdults] = useState(1);

  // State to store the selected cabin class
  const [cabinClass, setCabinClass] = useState('economy');

  // State to store the selected travel date
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);

  // State to manage the loading state for destination search
  const [destinationLoading, setDestinationLoading] = useState(false);

  // State to manage the loading state for flight search
  const [loading, setLoading] = useState(false);

  // State to store the flight search results
  const [results, setResults] = useState([]);

  // Ref to manage debouncing for user input
  const typingTimeoutRef = useRef(null);

  // Ref to manage aborting previous HTTP requests
  const abortControllerRef = useRef(null);

  // Handle changes in the destination input
  const handleDestinationChange = (query) => {
    // Reset selected destination if the input changes
    if (selectedDestination && query !== destination) {
      setSelectedDestination(null);
    }
    setDestination(query);

    // Clear any previous debounce timers
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Abort the previous HTTP request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // If the query is empty, clear the dropdown results and return early
    if (!query) {
      setDropdownResults([]);
      return;
    }

    // Debounce: Wait for 500ms before making the API call
    typingTimeoutRef.current = setTimeout(async () => {
      setDestinationLoading(true); // Set loading state for destination search
      const controller = new AbortController(); // Create a new AbortController
      abortControllerRef.current = controller;

      try {
        // Call the searchAirport API with the current query
        const response = await searchAirport(query, { signal: controller.signal });
        if (response && response.data) {
          // Format the results to extract necessary data
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
          setDropdownResults(formattedResults); // Update the dropdown results state
        } else {
          setDropdownResults([]);
        }
      } catch (error) {
        // Ignore errors caused by request abortion
        if (error.name !== 'AbortError') {
          console.error('Error searching destination:', error);
          setDropdownResults([]);
        }
      } finally {
        setDestinationLoading(false); // Clear loading state
        abortControllerRef.current = null; // Reset the AbortController ref
      }
    }, 500);
  };

  // Handle selection of a destination from the dropdown
  const handleDestinationSelect = (dest) => {
    if (!dest.skyId || !dest.entityId) {
      alert('Selected destination does not have valid identifiers.');
      return;
    }
    setSelectedDestination(dest); // Update the selected destination
    setDropdownResults([]); // Clear the dropdown results
    setDestination(dest.name); // Set the destination input to the selected destination's name
  };

  // Handle submission of the flight search form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!selectedDestination) {
      alert('Please select a valid destination.');
      return;
    }

    setLoading(true); // Set loading state for flight search
    try {
      // Prepare the flight search data
      const flightData = {
        origin,
        destination: selectedDestination,
        date: travelDate,
        adults,
        cabinClass,
      };

      // Call the searchFlights API
      const response = await searchFlights(flightData);
      const itineraries = response?.data?.itineraries || []; // Extract itineraries from the response
      setResults(itineraries); // Update the results state
    } catch (error) {
      console.error('Error searching flights:', error);
      setResults([]); // Clear results in case of an error
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      {/* Render the flight search form */}
      <FlightSearchForm
        origin={origin} // Pass the selected origin
        onBack={onBack} // Callback to go back to the airport selection
        destination={destination} // Current destination input
        destinationLoading={destinationLoading} // Loading state for destination search
        dropdownResults={dropdownResults} // Dropdown results for the destination input
        selectedDestination={selectedDestination} // Selected destination
        travelDate={travelDate} // Current travel date
        adults={adults} // Current number of adults
        cabinClass={cabinClass} // Selected cabin class
        loading={loading} // Loading state for flight search
        onDestinationChange={handleDestinationChange} // Callback for destination input change
        onDestinationSelect={handleDestinationSelect} // Callback for destination selection
        onDateChange={setTravelDate} // Callback for travel date change
        onAdultsChange={setAdults} // Callback for adults count change
        onCabinClassChange={setCabinClass} // Callback for cabin class change
        onSubmit={handleSubmit} // Callback for form submission
      />

      {/* Render the flight results */}
      <div style={{ marginTop: '20px' }}>
        <FlightResults results={results} />
      </div>
    </div>
  );
};

export default FlightSearchContainer;
