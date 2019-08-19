import React, { useState } from 'react';
import styled from "styled-components";
import { Container, Button, Alert } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

function Home() {
  const [showButton, setShowButton] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  return (
    <Wrapper>
      <div className="title">Welcome to Page Transition App!</div>
      <Container style={{ paddingTop: '2rem' }}>
      {showButton && (
        <Button
          onClick={() => setShowMessage(true)}
          size="lg"
        >
          Show Message
        </Button>
      )}
      <CSSTransition
        in={showMessage}
        timeout={300}
        classNames="alert"
        unmountOnExit
        onEnter={() => setShowButton(false)}
        onExited={() => setShowButton(true)}
      >
        <Alert
          variant="primary"
          dismissible
          onClose={() => setShowMessage(false)}
        >
          <Alert.Heading>
            Animated alert message
          </Alert.Heading>
          <p>
            This alert message is being transitioned in and
            out of the DOM.
          </p>
          <Button onClick={() => setShowMessage(false)}>
            Close
          </Button>
        </Alert>
      </CSSTransition>
    </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
    /* omitted */
`;

export default Home;