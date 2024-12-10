import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const AirportSearchForm = ({ loading, setQuery, onSearch,query }) => (
  <Box sx={{ padding: 2, maxWidth: 600, margin: 'auto' }}>
    <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
      Select Origin Airport
    </Typography>

    <TextField
      fullWidth
      variant="outlined"
      label="Search Airport (City, Place, etc.)"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      sx={{ marginBottom: 2 }}
    />

    <Button
      variant="contained"
      fullWidth
      onClick={onSearch}
      disabled={loading}
      sx={{ marginBottom: 2 }}
    >
      Search
    </Button>
  </Box>
);

export default AirportSearchForm;
