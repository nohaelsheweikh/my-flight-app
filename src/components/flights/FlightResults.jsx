import React from 'react';
import { Typography } from '@mui/material';
import FlightResultCard from './FlightResultCard';

const FlightResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <Typography>No results found.</Typography>;
  }

  return (
    <>
      {results.map((itinerary, index) => (
        <FlightResultCard key={itinerary.id || index} itinerary={itinerary} />
      ))}
    </>
  );
};

export default FlightResults;
