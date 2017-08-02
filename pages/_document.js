// @flow

import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet, injectGlobal } from 'styled-components';
import Helmet from 'react-helmet';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  html {
    font-size: 62.5%;
    box-sizing: border-box;
  }

  body {
    font-family: "Open Sans", sans-serif;
    font-size: 1.6rem;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "PT Serif", serif;
  }

  a {
    text-decoration: none;
  }

  select.form-control,
  textarea.form-control,
  input.form-control {
    font-size: 1.6rem;
  }
  
  input[type=file] {
    width: 100%;
  }
`;

export default class extends Document {
  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);
    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it
    return { ...documentProps, helmet: Helmet.renderStatic() };
  }

  // should render on <html>
  helmetHtmlAttrComponents() {
    return this.props.helmet.htmlAttributes.toComponent();
  }

  // should render on <body>
  helmetBodyAttrComponents() {
    return this.props.helmet.bodyAttributes.toComponent();
  }

  // should render on <head>
  helmetHeadComponents() {
    return Object.keys(this.props.helmet)
      .filter(el => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map(el => this.props.helmet[el].toComponent());
  }

  helmetJsx = () =>
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title="Serverless Stack"
      meta={[{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]}
    />;

  render() {
    const sheet = new ServerStyleSheet();
    const main = sheet.collectStyles(<Main />);
    const styleTags = sheet.getStyleElement();

    return (
      <html {...this.helmetHtmlAttrComponents()}>
        <Head>
          {this.helmetJsx()}
          {this.helmetHeadComponents()}
          <link rel="apple-touch-icon" sizes="180x180" href="static/apple-touch-icon.png" />
          <link rel="icon" type="image/png" href="static/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="static/favicon-16x16.png" sizes="16x16" />
          <link rel="manifest" href="static/manifest.json" />
          <link rel="mask-icon" href="static/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="theme-color" content="#ffffff" />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://fonts.googleapis.com/css?family=PT+Serif|Open+Sans:300,400,600,700,800"
          />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
          {styleTags}
        </Head>
        <body className="root" {...this.helmetBodyAttrComponents()}>
          {main}
          <NextScript />
        </body>
      </html>
    );
  }
}
