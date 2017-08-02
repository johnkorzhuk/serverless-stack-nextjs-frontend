// @flow

import React from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

import config from '../../config';

const getCurrentUser = () => {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  return userPool.getCurrentUser();
};

const getUserToken = currentUser =>
  new Promise((resolve, reject) => {
    currentUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });

const handleLogOut = () => {
  const currentUser = getCurrentUser();

  if (currentUser !== null) {
    currentUser.signOut();
  }

  if (AWS.config.credentials) {
    AWS.config.credentials.clearCachedId();
  }
};

// We're doing the session storage on the client side. It might be worth it to look into doing
// it on the server-side to reduce bundle size.
const withSession = (BaseComponent: ReactClass<any>) =>
  class extends React.Component {
    state = {
      loading: true
    };

    props: {
      updateUserToken: Function
    };

    // not sure how to type this
    // $FlowFixMe
    async componentDidMount(): Promise<void> {
      const currentUser = getCurrentUser();

      if (currentUser === null) {
        this.setState({ loading: false });
        return;
      }

      try {
        const userToken = await getUserToken(currentUser);
        this.setState({ loading: false });
        // Since this is wrapping Header anytime your navigate to a new page this gets invoked.
        // meaning this component is constantly mounting an unmounting. I'm not sure if this is
        // normal for Next.js or a performance problem.
        this.props.updateUserToken(userToken);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }

      this.setState({ loading: false });
    }

    render() {
      const { loading } = this.state;
      return <BaseComponent loading={loading} logOut={handleLogOut} {...this.props} />;
    }
  };

export default withSession;
