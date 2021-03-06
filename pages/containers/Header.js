// @flow
import type { Children } from 'react';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';

import type { State } from '../../store/types';

import NavBar from '../components/NavBar';

import withSession from '../hoc/withSession';
import { logOut, updateUserToken } from '../../store/auth/actions';

const App = styled.div`margin-top: 15px;`;

class Header extends Component {
  state = {
    pathname: '/'
  };

  componentDidMount() {
    this.setState({
      pathname: Router.pathname
    });
    Router.onRouteChangeStart = pathname => {
      this.setState({
        pathname
      });
    };
  }

  props: {
    children: Children,
    userToken: string,
    loading: boolean,
    logOut: Function,
    // gets passed to withSession
    // eslint-disable-next-line react/no-unused-prop-types
    updateUserToken: Function
  };

  handleNavLink = (event: SyntheticEvent & { currentTarget: HTMLLinkElement }) => {
    event.preventDefault();
    Router.push(event.currentTarget.getAttribute('href'));
  };

  handleLogout = () => {
    this.props.logOut();
    Router.push('/login');
  };

  render() {
    const { children, userToken, loading } = this.props;
    const { pathname } = this.state;
    return (
      // this is fine
      // $FlowFixMe
      !loading &&
      <App className="App container">
        <NavBar pathname={pathname} userToken={userToken} onNav={this.handleNavLink} onLogOut={this.handleLogout} />
        {children}
      </App>
    );
  }
}

export default connect(
  (state: State) => ({
    userToken: state.auth.userToken
  }),
  {
    logOut,
    updateUserToken
  }
)(withSession(Header));
