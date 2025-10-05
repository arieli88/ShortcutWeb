// src/components/Table.js
import React from 'react';
import { groupBy } from '../services/dataProcessor';
import Card from './Card';

const Table = ({ data }) => {
  const groupedData = groupBy(data, 'Groups');

  return (
    <div className="overflow-x-auto">
      {Object.entries(groupedData).map(([groupName, items]) => (
        <div key={groupName} className="mb-4">
          <h2 className="text-xl font-bold mb-2">{groupName || 'Uncategorized'}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <Card key={index} data={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Table;