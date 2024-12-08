// src/App.jsx

import React from 'react';
import TableComponent from './Components/TableComponent';

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <TableComponent organizationId = {1}/>
    </div>
  );
};

export default App;

