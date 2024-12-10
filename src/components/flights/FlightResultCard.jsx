import React from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Divider } from '@mui/material';

const FlightResultCard = ({ itinerary }) => {
  const { price, legs, tags } = itinerary;

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardHeader
        title={`Price: ${price?.formatted || 'N/A'}`}
        subheader={tags?.length ? tags.join(', ') : ''}
      />
      <CardContent>
        {legs?.map((leg, legIndex) => (
          <Box key={leg.id || legIndex} sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {leg.origin?.name} ({leg.origin?.displayCode}) → {leg.destination?.name} ({leg.destination?.displayCode})
            </Typography>
            <Typography variant="body2">Departure: {leg.departure}</Typography>
            <Typography variant="body2">Arrival: {leg.arrival}</Typography>
            <Typography variant="body2">Duration: {leg.durationInMinutes} min</Typography>
            <Typography variant="body2">Stops: {leg.stopCount}</Typography>
            <Divider sx={{ marginY: 1 }} />
            {leg.segments?.map((seg, segIndex) => (
              <Box key={seg.id || segIndex} sx={{ marginBottom: 1 }}>
                <Typography variant="body2">
                  {seg.origin.displayCode} ({seg.origin.name}) → {seg.destination.displayCode} ({seg.destination.name})
                </Typography>
                <Typography variant="body2">Flight: {seg.marketingCarrier?.alternateId}{seg.flightNumber}</Typography>
                <Typography variant="body2">Departure: {seg.departure}</Typography>
                <Typography variant="body2">Arrival: {seg.arrival}</Typography>
              </Box>
            ))}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default FlightResultCard;
