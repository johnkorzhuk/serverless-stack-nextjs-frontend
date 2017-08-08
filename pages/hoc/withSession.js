// @flow

import React from 'react';

import { getUserToken } from '../../libs/awsLib';

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
      try {
        const userToken = await getUserToken();
        if (userToken) {
          this.setState({ loading: false });
          // Since this is wrapping Header anytime your navigate to a new page this gets invoked.
          // meaning this component is constantly mounting an unmounting. I'm not sure if this is
          // normal for Next.js or a performance problem.
          this.props.updateUserToken(userToken);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }

      this.setState({ loading: false });
    }

    render() {
      const { loading } = this.state;
      return <BaseComponent loading={loading} {...this.props} />;
    }
  };

export default withSession;
