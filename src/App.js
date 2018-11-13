import React, { Component } from 'react';
import './App.css';

import { Provider, Client } from 'urql';

const client = new Client({
  url: 'https://api.github.com/graphql',
});


const App = () => {
  (
      <Provider client={client}>
      </Provider>
    );
  }

export default App;


