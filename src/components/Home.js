import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Form,
  Card,
  CardGroup,
  Table,
  Spinner,
  Container,
  Row,
} from "react-bootstrap";

const UserRow = ({ item, onClick }) => (
  <tr onClick={onClick}>
    <td>{item.uploader}</td>
    <td>{item.filename}</td>
    <td>{item.DocID}</td>
    <td>{item.checksum}</td>
  </tr>
);

export default function Home() {
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(
    "1def78ca-daa0-4eb3-8813-0329dedb5065"
  );
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCheckedUpload, setisCheckedUpload] = useState(false);
  const [isCheckedDownload, setisCheckedDownload] = useState(false);

  useEffect(() => {
    async function fetchData() {
      var getFiles =
        "https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getFiles?user=Laurens&api=PXW64JdS4dP2HJNQFt9D";
      var getLogs = `https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getLogs?user=Laurens&api=PXW64JdS4dP2HJNQFt9D&id=${selectedLog}`; //Moet nog aangepast  worden

      const requestOne = axios.get(getFiles);
      const requestTwo = axios.get(getLogs);
      axios
        .all([requestOne, requestTwo])
        .then(
          axios.spread((...responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];

            setFiles(responseOne.data.Items);
            setLogs(responseTwo.data.Items);
            setLoading(false);
          })
        )
        .catch((errors) => {
          console.error(errors);
        });
    }
    fetchData();
  }, [selectedLog]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleUserClick(item) {
    setSelectedLog(item.DocID);
  }

  return (
    <div>
      <CardGroup>
        <Card>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Upload</Form.Label>

                <Form.Group controlId="formPasswordUpload">
                  <Form.Group controlId="formPasswordSwitchUpload">
                    <Form.Check
                      type="switch"
                      label={
                        isCheckedUpload
                          ? "Password enabled"
                          : "Password disabled"
                      }
                      checked={isCheckedUpload}
                      onChange={(e) => {
                        setisCheckedUpload(e.target.checked);
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPasswordUpload">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      disabled={isCheckedUpload ? false : true}
                    />
                  </Form.Group>
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

                <Form.Group controlId="formUUIDDownload">
                  <Form.Label>UUID</Form.Label>
                  <Form.Control placeholder="UUID" />
                </Form.Group>

                <Form.Group controleId="formPasswordDownload">
                  <Form.Group controlId="formPasswordSwitchDownload">
                    <Form.Check
                      type="switch"
                      label={isCheckedDownload ? "Has password" : "No password"}
                      checked={isCheckedDownload}
                      onChange={(e) => {
                        setisCheckedDownload(e.target.checked);
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPasswordDownload">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      disabled={isCheckedDownload ? false : true}
                    />
                  </Form.Group>
                </Form.Group>

                <Form.Group controleId="formChecksumDownload">
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
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {loading ? (
        <Spinner
          animation="border"
          variant="primary"
          style={{ marginLeft: "50%", marginTop: "15%" }}
        />
      ) : (
        <Container style={{ marginTop: "5%" }}>
          <Row>
            <h2>All files</h2>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Uploader</th>
                  <th>Filename</th>
                  <th>Document ID</th>
                  <th>Checksum</th>
                </tr>
              </thead>
              <tbody>
                {files.map((item, i) => (
                  <UserRow
                    key={i}
                    item={item}
                    onClick={handleUserClick.bind(this, item)}
                  />
                ))}
              </tbody>
            </Table>
          </Row>
          <Row>
            <h2>Logs of selected file</h2>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Uploader</th>
                  <th>Document ID</th>
                  <th>Log ID</th>
                  <th>Log time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((item, i) => (
                  <tr key={i}>
                    <td>{item.username}</td>
                    <td>{item.DocID}</td>
                    <td>{item.LogID}</td>
                    <td>{item.LogTime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>
      )}
    </div>
  );
}

/*  <Button variant="primary" onClick={handleShow}>
                    Access logs
                  </Button>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Logs of file: {item.filename}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Uploader</th>
                            <th>Document ID</th>
                            <th>Log ID</th>
                            <th>Log time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.map((item, i) => (
                            <tr key={i}>
                              <td>{item.username}</td>
                              <td>{item.DocID}</td>
                              <td>{item.LogID}</td>
                              <td>{item.LogTime}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="danger" onClick={handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>*/
