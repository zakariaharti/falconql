// Footer Component

// -----------------------------------------------------------------------------
// IMPORTS

/** NPM */
import * as React from 'react';

/** LOCAL */
import styled from '@/client/helpers/styledComponents';

// -----------------------------------------------------------------------------

const StyledFooter = styled.footer`
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: gray;
`;

const Footer: React.SFC<{}> = () => (
  <StyledFooter>
    <p>footer content goes here</p>
  </StyledFooter>
);

export default Footer;
