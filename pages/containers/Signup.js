// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { AuthenticationDetails, CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import Router from 'next/router';

import { HelpBlock, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';

import config from '../../config';

const Container = styled.div`
  padding: 60px 0;

  & form {
    margin: 0 auto;
    max-width: 320px;

    & span.help-block {
      font-size: 14px;
      padding-bottom: 10px;
      color: #999;
    }
  }
`;

const signup = (username: string, password: string) => {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  const attributeEmail = new CognitoUserAttribute({ Name: 'email', Value: username });

  return new Promise((resolve, reject) =>
    userPool.signUp(username, password, [attributeEmail], null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result.user);
    })
  );
};

const confirm = (user: ?Object, confirmationCode: string) =>
  new Promise(
    (resolve, reject) =>
      user &&
      user.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      })
  );

const authenticate = (user: ?Object, username: string, password: string) => {
  const authenticationData = {
    Username: username,
    Password: password
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise(
    (resolve, reject) =>
      user &&
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(result.getIdToken().getJwtToken()),
        onFailure: err => reject(err)
      })
  );
};

type State = {
  loading: boolean,
  username: string,
  password: string,
  confirmPassword: string,
  confirmationCode: string,
  newUser: Object | null
};

class Signup extends Component {
  state: State = {
    loading: false,
    username: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
    newUser: null
  };

  props: {
    updateUserToken: Function
  };

  validateForm() {
    return (
      this.state.username.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = (event: SyntheticEvent & { target: HTMLInputElement }) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    this.setState({ loading: true });

    try {
      const newUser = await signup(this.state.username, this.state.password);
      this.setState({
        newUser
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }

    this.setState({ loading: false });
  };

  handleConfirmationSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    this.setState({ loading: true });

    try {
      await confirm(this.state.newUser, this.state.confirmationCode);
      const userToken = await authenticate(this.state.newUser, this.state.username, this.state.password);

      this.props.updateUserToken(userToken);
      Router.push('/');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.setState({ loading: false });
    }
  };

  renderConfirmationForm() {
    const { confirmationCode, loading } = this.state;

    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl autoFocus type="tel" value={confirmationCode} onChange={this.handleChange} />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          loading={loading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    const { loading, username, password, confirmPassword } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="username" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl autoFocus type="email" value={username} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl value={password} onChange={this.handleChange} type="password" />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl value={confirmPassword} onChange={this.handleChange} type="password" />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          loading={loading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    const { newUser } = this.state;
    return (
      <Container>
        {newUser === null ? this.renderForm() : this.renderConfirmationForm()}
      </Container>
    );
  }
}

export default Signup;
