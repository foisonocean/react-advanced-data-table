import React, { Component } from 'react';
import casual from 'casual-browserify';
import './app.css';

import Table from './lib';

const fakeData = Array.from({length: 2000}).map(() => ({
  name: casual.name,
  age: casual.integer(4, 48),
  gender: Math.random() > 0.5 ? 'Male' : 'Female',
  phone: casual.phone,
  country: casual.country,
  city: casual.city,
  street: casual.street,
  date: casual.date('YYYY-MM-DD'),
  language: casual.locale,
  favoriteColor: casual.color_name,
  code1: casual.uuid,
  code2: casual.uuid,
  code3: casual.uuid,
  code4: casual.uuid,
}));

const tableConfig = [
  {
    name: 'Name',
    dataKey: 'name',
    width: 300,
  },
  {
    name: 'Age',
    dataKey: 'age',
  },
  {
    name: 'Gender',
    dataKey: 'gender',
  },
  {
    name: 'Phone',
    dataKey: 'phone',
    width: 300,
  },
  {
    groupName: 'Code',
    columns: [
      {
        name: 'Code 1',
        dataKey: 'code1',
        width: 300,
      },
      {
        name: 'Code 2',
        dataKey: 'code2',
      },
    ],
  }
];

class App extends Component {
  render() {
    return (
      <div className="example">
        Hello
        <div className="table-container">
          <Table
            data={fakeData}
            columnsConfig={tableConfig}
          />
        </div>
      </div>
    );
  }
}

export default App;
