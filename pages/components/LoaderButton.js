// @flow

import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: scale(1) rotate(0deg); }
  to { transform: scale(1) rotate(360deg); }
`;

const StyledGlyphicon = styled(Glyphicon)`
  margin-right: 7px;
  top: 2px;
  animation: ${spin} 1s infinite linear;
`;

type Props = {
  loading: boolean,
  text: string,
  loadingText: string,
  disabled?: boolean
};

const LoaderButton = ({ loading, text, loadingText, disabled = false, ...props }: Props) =>
  <Button disabled={disabled || loading} {...props}>
    {loading && <StyledGlyphicon glyph="refresh" className="spinning" />}
    {!loading ? text : loadingText}
  </Button>;

export default LoaderButton;
