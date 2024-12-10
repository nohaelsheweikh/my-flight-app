# Flight Search Application

## Overview

This application allows users to search for flights between origins and destinations, fetch nearby airports, and view results. It is built with React and Material-UI for the front-end, using modern React features like functional components, hooks (useState and useEffect), and Axios for API calls.

State Management Approach
Given the simplicity of the application's scope and the time constraints during development, a dedicated state management library (e.g., Redux, Mobx) was not implemented. Instead, state is efficiently managed at the component level using React's built-in hooks. This approach ensures that the application remains lightweight and easy to maintain while still achieving the desired functionality.
## Demo

![Demo of the project](./demo.gif)
## Features

- **Search Airports**: Search for airports by city or place name.
- **Nearby Airports**: Fetch nearby airports using geolocation.
- **Flight Search**: Search flights between selected origin and destination airports.
- **Responsive Design**: Built with Material-UI for a clean and responsive UI.

## Technologies Used

- React
- Material-UI
- Axios
- Vitest (for unit testing)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:

   ```env
   VITE_API_BASE_URL=https://sky-scrapper.p.rapidapi.com
   VITE_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Run tests:

   ```bash
   npm test
   ```

## Project Structure

```plaintext
src/
├── components/
│   ├── flights/
│   │   ├── AirportSearchForm.jsx
│   │   ├── AirportResults.jsx
│   │   ├── FlightSearchForm.jsx
│   │   ├── FlightResults.jsx
├── containers/
│   ├── AirportSearchContainer.jsx
│   ├── FlightSearchContainer.jsx
├── services/
│   ├── api.js
├── tests/
│   ├── services/
│   │   ├── api.test.js
```

## Notes

- Replace `your_api_key_here` in the `.env` file with your actual RapidAPI key.
- Ensure geolocation is enabled in your browser to use the "Search Nearby Airports" feature.

## License

This project is licensed under the MIT License.
