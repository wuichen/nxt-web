import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class NormalSetupForm extends React.Component {
  setup() {
    this.props.setup();
  }

  render() {
    return (
      <div>
        create an example store &nbsp;
        <Button onClick={this.setup.bind(this)}>create store</Button>
      </div>
    );
  }
}

export default NormalSetupForm;
