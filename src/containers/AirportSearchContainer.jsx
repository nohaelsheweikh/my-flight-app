import React, { useEffect, useState } from 'react';
import { getNearbyAirports, searchAirport } from '../services/api';
import AirportSearchForm from '../components/flights/AirportSearchForm';
import AirportResults from '../components/flights/AirportResults';

const AirportSearchContainer = ({ onSelectAirport }) => {
  // State to track loading status
  const [loading, setLoading] = useState(false);

  // State to store the list of search results
  const [results, setResults] = useState([]);

  // State to store the user's search query
  const [query, setQuery] = useState('');

  // useEffect to automatically fetch nearby airports on initial render
  useEffect(() => {
    fetchNearby();
  }, []);

  // Function to fetch nearby airports based on user's geolocation
  const fetchNearby = async () => {
    setLoading(true); // Start loading
    try {
      if (navigator.geolocation) {
        // Check if geolocation is supported by the browser
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords; // Get user's coordinates
            const response = await getNearbyAirports(latitude, longitude); // Fetch nearby airports
            setResults(response?.data?.nearby || []); // Update results state with fetched data
            setLoading(false); // Stop loading
          },
          (error) => {
            // Handle error if geolocation access is denied or fails
            console.error('Location access denied or error:', error);
            setLoading(false);
          }
        );
      } else {
        // Handle case where geolocation is not supported by the browser
        console.error('Geolocation not supported');
        setLoading(false);
      }
    } catch (error) {
      // Handle errors during the API call
      console.error('Error fetching nearby airports:', error);
      setLoading(false);
    }
  };

  // Function to handle search functionality when the user clicks the search button
  const handleSearch = async () => {
    setLoading(true); // Start loading
    try {
      const response = await searchAirport(query); // Fetch airports matching the search query
      setResults(response?.data || []); // Update results state with fetched data
    } catch (error) {
      // Handle errors during the API call
      console.error('Error searching airports:', error);
      setResults([]); // Clear results if there's an error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to handle the selection of an airport from the results
  const handleSelectAirport = (airport) => {
    // Extract relevant parameters needed for further operations
    const relevantParams = airport.navigation?.relevantFlightParams;

    // Validate if the selected airport has the necessary identifiers
    if (!relevantParams || !relevantParams.skyId || !relevantParams.entityId) {
      alert('Selected airport does not have valid identifiers.');
      return;
    }

    // Pass the selected airport's details to the parent component
    onSelectAirport({
      name: airport.presentation?.title || airport.name,
      skyId: relevantParams.skyId,
      entityId: relevantParams.entityId,
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      {/* Render the search form */}
      <AirportSearchForm
        loading={loading} // Pass loading state to the form
        setQuery={setQuery} // Function to update the query state
        query={query} // Current search query
        onSearch={handleSearch} // Function to trigger search
      />

      {/* Conditionally render loading message or results */}
      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Fetching nearby airports...</p>
      ) : (
        <AirportResults 
          results={results} // Pass the search results
          onSelectAirport={handleSelectAirport} // Function to handle airport selection
        />
      )}
    </div>
  );
};

export default AirportSearchContainer;
