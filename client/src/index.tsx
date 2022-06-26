import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';
import { Context } from './context/MainContext';
import Connect from './socket/Connect';

//Connect();
const root = ReactDOM.createRoot(document.querySelector('.wrapper') as HTMLElement);

root.render(
  <Context>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </Context>
);
