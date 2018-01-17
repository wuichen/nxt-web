import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';

const data = {
        "storeId": "9b42a381-c6b7-1vvvvvv1e7-b5rrr2c-a504102995c6",
        "companyId": "9b42a381-c6b7-11e7-b52c-a504102995c6",

    }

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <h1>Blank Page</h1>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}
