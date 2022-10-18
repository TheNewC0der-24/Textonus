import React, { useState, useEffect } from 'react';
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
  Alert,
  Input
} from 'reactstrap';

import Header from './Components/Header';

import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { FaCopy } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';

import { message } from 'antd';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-EN';

function App() {

  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("");
  const [text, setText] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    handleListen();
    // eslint-disable-next-line
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        mic.start();
      }
    }
    else {
      mic.stop();
      mic.onend = () => {
        message.info('Mic is off');
      }
    }

    mic.onstart = () => {
      message.success('Mic is on');
    }

    mic.onresult = event => {
      // Result is an array of all the words spoken
      const transcript = Array.from(event.results)
        // Map through the array and return the transcript
        .map(result => result[0])
        .map(result => result.transcript)
        // Join the array into a string
        .join('');
      // Set the note to the transcript
      setNote(transcript);
      mic.onerror = event => {
        message.error(event.error);
      }
    }
  }

  const handleSave = (e) => {
    // Push the note to the savedNotes array
    setSavedNotes([...savedNotes, note]);
    // localStorage.setItem('savedNotes', ([...savedNotes, note]));
    localStorage.setItem('savedNotes', note);

    localStorage.setItem('text', text);

    // Clear the note
    setNote('');

    // Clear the text
    setText('');

    // Stop the mic
    setIsListening(false);

    // Show a success message
    message.success('Note saved');
  }

  const handleCopy = () => {
    message.success('Copied to clipboard');
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }


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
                </CardTitle>
                <hr />
                {
                  isListening ? (
                    <div className='d-flex justify-content-center mx-auto'>
                      <BsFillMicFill className='fs-4 me-2 text-danger' />
                      <h5 className='text-danger'>Listening...</h5>
                    </div>
                  )
                    : (
                      <Alert className='d-flex justify-content-center mx-auto text-center' color="primary">
                        <BsFillMicMuteFill className='fs-4' />
                        <h5>Press the Start Button to record the Voice</h5>
                      </Alert>
                    )}

                <h4 className='text-center my-3'>OR</h4>

                <Input type="textarea" className='text-field w-100 mb-3' rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your note..."></Input>

                <div className='d-flex justify-content-end me-auto gap-2'>
                  <Button onClick={() => setIsListening(prevState => !prevState)} outline color={isListening ? 'warning' : 'success'}>{isListening ? "Stop" : "Start"}</Button>
                  <Button onClick={handleSave} disabled={note || text ? false : true} color='dark'>Save Note</Button>
                </div>
                <hr />
                <CardText>
                  <h5>Preview !!</h5>
                  <p>{note || text ? note || text : (<p>Nothing to Show !!</p>)}</p>
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card className='bg-light h-100 border-0 right-card'>
              <CardBody>
                <CardTitle>
                  <h3>Notes</h3>
                </CardTitle>
                <hr />
                <CardText>
                  <h5>Preview !!</h5>
                  {(
                    <div className='saved-note'>
                      <p>{localStorage.getItem('savedNotes') || localStorage.getItem('text') ? localStorage.getItem("savedNotes") || localStorage.getItem('text') : "No Preview Available..."} </p>
                    </div>
                  )}

                  {/* {savedNotes.map(n => (
                    <p key={n}>{n}</p>
                  ))} */}
                </CardText>
                <CopyToClipboard text={localStorage.getItem('savedNotes') || localStorage.getItem('text')}>
                  <Button onClick={handleCopy} disabled={localStorage.getItem('savedNotes') || localStorage.getItem('text') ? false : true} className='float-end fs-5' id='copy' color={copied ? 'success' : 'warning'}>{copied ? (<TiTick className='icon' />) : (<FaCopy className='icon' />)}</Button>
                </CopyToClipboard>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
