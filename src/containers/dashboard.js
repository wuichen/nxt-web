import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import { connect } from 'react-redux';
import authAction from '../redux/auth/actions';
import { invokeApig } from '../helpers/awsLib';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import axios from 'axios';

const { setup } = authAction;

const exampleStore = {
    "name": "Head Quarter",
    "businessCategory": {
        "businessCategorId": "",
        "title": "hair salon",
        "language": "tw",
        "text": "美髮"
    },
    "url": "string",
    "timeZone": "string",
    "currency": "NTD",
    "currencyDecimal": "0",
    "updatedAt": "datetime utc +0",
    "createdAt": "datetime utc +0"
}

class Dashboard extends Component {
  
  async setup() {
  	const sub = this.props.user.get('sub')
  	exampleStore.storeId = sub

  	// example of calling multiple api

  	try {
	    const storeResult = await invokeApig({
	  		path: "/stores",
	  		method: "POST",
	  		body: exampleStore,

	  		// this is the id for stores service
	  		serviceId: 'qlf7xi9935'
		})
		const companyResult = await invokeApig({
	  		path: "/companies",
	  		method: "POST",
	  		body: {companyId: sub},
	  		serviceId: 'qlf7xi9935'
		})

		console.log(storeResult, companyResult)

  	} catch (e) {
  		console.log(e)
  	}

  }

  async getStore() {
  	try {
  		const userResult = await invokeApig({
	  		path: "/stores/ancdiddd",
	  		serviceId: 'qlf7xi9935'
		})

		console.log(userResult)
  	} catch (e) {
  		console.log(e)
  	}
  }

  async getUser() {
    const token = localStorage.getItem('id_token')
    const sub = this.props.user.get('sub')
    try {
      const userResult = await axios({
        method: 'GET',
        url: 'https://95lxfd1va7.execute-api.ap-northeast-1.amazonaws.com/v1/users/ffffffffssss',
        params: {
          sub: sub
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(userResult)
    } catch (e) {
      console.log(e)
    }
  //   const sub = this.props.user.get('sub')

  // 	try {
  // 		const userResult = await invokeApig({
	 //  		path: "/users/ffffffffssss",
	 //  		serviceId: '95lxfd1va7',
  //       queryParams: {
  //         sub: sub
  //       }
		// })

		// console.log(userResult)
  // 	} catch (e) {
  // 		console.log(e)
  // 	}
  }

  // componentDidMount() {
  //   const user = this.props.user.toJSON()
  //   console.log(user)
  // }

  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <h1>Page for api examples</h1>
          <div>
          	create an example store &nbsp;
        	<Button onClick={this.setup.bind(this)}>create store</Button>
          </div>

          <div>
          	get an example store &nbsp;
        	<Button onClick={this.getStore.bind(this)}>get store</Button>
          </div>
          <div>
          	get an example user &nbsp;
        	<Button onClick={this.getUser.bind(this)}>get user</Button>
          </div>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}
export default connect(
  state => ({
    user: state.Auth.get("user")
  }),
  { setup }
)(Dashboard);