import React, { useState } from 'react';
import './App.css';

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from 'reactstrap';

import Header from './Components/Header';

import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-IN';

function App() {

  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  return (
    <>
      <Header />

      <Container className='mt-5'>
        <Row>
          <Col md={6}>
            <Card className='bg-light h-100 border-0'>
              <CardBody>
                <CardTitle>
                  <h3>Current Note</h3>
                  <hr />
                  {isListening ? <BsFillMicFill /> : <BsFillMicMuteFill />}
                  <div className='my-5 d-flex justify-content-end me-auto gap-2'>
                    <Button onClick={() => setIsListening(prevState => !prevState)} outline color='secondary'>Start/Stop</Button>
                    <Button disabled={!note} onClick={handleSave} color='dark'>Save Note</Button>
                  </div>
                </CardTitle>
                <CardText>
                  <p>{note}</p>
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card className='bg-light h-100 border-0 right-card'>
              <CardBody>
                <CardTitle>
                  <h3>Notes</h3>
                  <hr />
                </CardTitle>
                <CardText>
                  {savedNotes.map(n => (
                    <p key={n}>{n}</p>
                  ))}
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
