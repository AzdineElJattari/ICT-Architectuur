import React, { useState, useEffect } from "react";
import { Button, FormGroup, Modal, Form, Card, CardGroup} from "react-bootstrap";

export default function Home() {
  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <CardGroup>
        <Card>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Upload</Form.Label>

                <Form.Group controlId="formPasswordCheckbox">
                  <Form.Check type="switch" label="Enable password" checked={isChecked} onChange={(e)=>{setIsChecked(e.target.checked)}} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" disabled={isChecked ? false : true} />
                </Form.Group>

                <Form.Group controlId="formFileUpload">
                  <Form.File
                    className="position-relative"
                    required
                    name="file"
                    label="File"
                    id="file"
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleShow}>
                  Bestand uploaden
                </Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        <Card>
        <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Download</Form.Label>

                <Form.Group controlId="formUUID">
                  <Form.Label>UUID</Form.Label>
                  <Form.Control placeholder="UUID" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Checksum: 0</Form.Label>
                </Form.Group>

                <Button variant="primary" onClick={handleShow}>
                  Download bestand
                </Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </CardGroup>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
