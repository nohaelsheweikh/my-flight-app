import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const AirportResults = ({ results, onSelectAirport }) => {
  if (!results || results.length === 0) {
    return (
      <Typography align="center" sx={{ marginTop: 2 }}>
        No results found.
      </Typography>
    );
  }

  return (
    <Box sx={{ marginTop: 2, minHeight: '200px' }}>
      <List>
        {results.map((airport, index) => (
          <ListItem
            key={airport.entityId || `${airport.name}-${index}`}
            onClick={() => onSelectAirport(airport)}
            sx={{
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <ListItemText
              primary={airport.presentation?.title || airport.name}
              secondary={airport.presentation?.subtitle || airport.country}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AirportResults;
