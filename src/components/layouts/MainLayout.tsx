import { ReactNode } from 'react';
import styled from 'styled-components';
import { Footer } from '../footer/Footer';
import { Header } from '../header/Header';
import { Navigation } from '../navigation/Navigation';

const StyledContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const StyledContent = styled.div`
  display: flex;
  flex-grow: 1;
`;

const StyledSreen = styled.main`
  flex-grow: 1;
  padding: 12px;
`;

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <StyledContainer>
      <StyledPage>
        <Header />
        <StyledContent>
          <Navigation />
          <StyledSreen>{children}</StyledSreen>
        </StyledContent>
        <Footer />
      </StyledPage>
    </StyledContainer>
  );
}
