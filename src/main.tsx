import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import App from './App';
import theme from './theme'; // Your custom theme with color mode config
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import './i18n'

const queryClient = new QueryClient(); 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      {/* Ensures correct color mode is loaded before app renders */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </QueryClientProvider>
    </ChakraProvider>
   
  </React.StrictMode>
);
