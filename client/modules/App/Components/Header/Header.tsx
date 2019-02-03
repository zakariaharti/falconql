// Header Component

// -----------------------------------------------------------------------------
// IMPORTS

/** NPM */
import * as React from 'react';

/** LOCAL */
import styled from '../../../../helpers/styledComponents';

// -----------------------------------------------------------------------------

const StyledHeader = styled.div`
  margin: 0;
  padding: 0;
`;

const StyledNavbar = styled.nav`
  width: 100%;
`;

const Header: React.SFC<{}> = () => (
  <StyledHeader>
    <h5>FalconQl Project</h5>
    <StyledNavbar>
      <a href="#">link 1</a>
      <a href="#">link 2</a>
      <a href="#">link 3</a>
    </StyledNavbar>
  </StyledHeader>
);

export default Header;
