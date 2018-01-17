import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class NormalSignUpForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, signUpCredentials) => {
      if (!err) {
        this.props.signUp(signUpCredentials);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('familyName', {
            rules: [{ required: true, message: 'Please input your last name!' }],
          })(
            <Input placeholder="last name" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('givenName', {
            rules: [{ required: true, message: 'Please input your first name!' }],
          })(
            <Input placeholder="first name" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('signUp_email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input placeholder="email" />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('signUp_password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input type="password" placeholder="Password" />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('promo', {
            rules: [{ required: true, message: 'Please input your Promo!' }],
          })(
            <Input placeholder="promo" />
          )}
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Sign Up
          </Button>
        </FormItem>


      </Form>
    );
  }
}

const WrappedNormalSignUpForm = Form.create()(NormalSignUpForm);
export default WrappedNormalSignUpForm;
