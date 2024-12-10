import React from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from '@mui/material';

const FlightSearchForm = ({
  origin,
  onBack,
  destination,
  destinationLoading,
  dropdownResults,
  selectedDestination,
  travelDate,
  adults,
  cabinClass,
  loading,
  onDestinationChange,
  onDestinationSelect,
  onDateChange,
  onAdultsChange,
  onCabinClassChange,
  onSubmit
}) => (
  <Box component="form" onSubmit={onSubmit} sx={{ padding: 2, maxWidth: 800, margin: 'auto' }}>
    <Typography variant="h5" gutterBottom>Flight Search</Typography>
    <Typography variant="body1" gutterBottom>
      Origin: {origin?.name || 'Not Selected'}
    </Typography>

    <Button variant="outlined" onClick={onBack} sx={{ marginBottom: 2 }}>
      Back to Origin Selection
    </Button>

    <TextField
      fullWidth
      label="Search Destination"
      variant="outlined"
      value={destination}
      onChange={(e) => onDestinationChange(e.target.value)}
      sx={{ marginBottom: 2 }}
    />

    {destinationLoading && <CircularProgress size={24} />}

    {/* Only show dropdown if we have results AND no destination is selected yet */}
    {!selectedDestination && dropdownResults.length > 0 && (
      <Box
        sx={{
          position: 'relative',
          border: '1px solid #ccc',
          borderRadius: 2,
          backgroundColor: '#fff',
          zIndex: 2,
          maxHeight: '200px',
          overflowY: 'auto',
          marginBottom: 2,
        }}
      >
        {dropdownResults.map((result) => (
          <Box
            key={result.entityId}
            sx={{
              padding: 1,
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
            onClick={() => onDestinationSelect(result)}
          >
            {result.name}
          </Box>
        ))}
      </Box>
    )}

    {selectedDestination && (
      <>
        <TextField
          fullWidth
          label="Travel Date"
          type="date"
          variant="outlined"
          value={travelDate}
          onChange={(e) => onDateChange(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: new Date().toISOString().split('T')[0],
          }}
          sx={{ marginBottom: 2 }}
        />

        <TextField
          fullWidth
          label="Number of Adults"
          type="number"
          variant="outlined"
          value={adults}
          onChange={(e) => onAdultsChange(Number(e.target.value))}
          inputProps={{ min: 1 }}
          sx={{ marginBottom: 2 }}
        />

        <Typography variant="subtitle1" gutterBottom>Cabin Class</Typography>
        <RadioGroup
          value={cabinClass}
          onChange={(e) => onCabinClassChange(e.target.value)}
          row
          sx={{ marginBottom: 2 }}
        >
          <FormControlLabel value="economy" control={<Radio />} label="Economy" />
          <FormControlLabel value="business" control={<Radio />} label="Business" />
          <FormControlLabel value="first" control={<Radio />} label="First Class" />
        </RadioGroup>

        <Button type="submit" variant="contained" disabled={loading} sx={{ marginBottom: 3 }}>
          {loading ? <CircularProgress size={24} /> : 'Search Flights'}
        </Button>

        <Divider sx={{ marginBottom: 2 }} />
      </>
    )}
  </Box>
);

export default FlightSearchForm;
