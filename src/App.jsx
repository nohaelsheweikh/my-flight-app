import React, { useState } from 'react';
import AirportSearchContainer from './containers/AirportSearchContainer';
import FlightSearchContainer from './containers/FlightSearchContainer';

// App component serves as the main entry point for the application.
// It manages the state of the selected origin airport and conditionally renders
// either the AirportSearchContainer or FlightSearchContainer based on whether an origin is selected.

const App = () => {
  const [origin, setOrigin] = useState(null);

  const handleSelectAirport = (airport) => {
    setOrigin(airport);
  };

  const handleBackToAirportSelection = () => {
    setOrigin(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      {!origin ? (
        <AirportSearchContainer onSelectAirport={handleSelectAirport} />
      ) : (
        <FlightSearchContainer
          origin={origin}
          onBack={handleBackToAirportSelection}
        />
      )}
    </div>
  );
};

export default App;
