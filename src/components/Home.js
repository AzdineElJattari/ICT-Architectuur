import React, { useState, useEffect } from "react";
import correct from "../images/correct.png";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactTooltip from "react-tooltip";
import {
  Button,
  Form,
  Card,
  CardGroup,
  Table,
  Spinner,
  Container,
  Row,
} from "react-bootstrap";
import axios from "axios";

const UserRow = ({ item, onClick }) => (
  <>
    <ReactTooltip />
    <tr
      onClick={onClick}
      style={{ cursor: "pointer" }}
      data-tip="Click on the row of an specific file to retrieve the logs"
    >
      <td>{item.filename}</td>
      <td>{item.DocID}</td>
      <td>{item.checksum}</td>
    </tr>
  </>
);

export default function Home() {
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [presignedDownloadUrl, setPresignedDownloadUrl] = useState({});
  const [selectedLog, setSelectedLog] = useState(
    "1def78ca-daa0-4eb3-8813-0329dedb5065"
  );
  const [hasGivenUuid, setHasGivenUuid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      var getFiles =
        "https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getFiles?user=Laurens&api=PXW64JdS4dP2HJNQFt9D";
      var getLogs = `https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getLogs?user=Laurens&api=PXW64JdS4dP2HJNQFt9D&id=${selectedLog}`;
      var getDownloadUrl = `https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getDownloadURL?user=Laurens&api=PXW64JdS4dP2HJNQFt9D&id=1def78ca-daa0-4eb3-8813-0329dedb5065`;

      const requestOne = axios.get(getFiles);
      const requestTwo = axios.get(getLogs);
      const requestThree = hasGivenUuid
        ? axios.get(
            `https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getDownloadURL?user=Laurens&api=PXW64JdS4dP2HJNQFt9D&id=${downloadUrl}`
          )
        : axios.get(getDownloadUrl);
      axios
        .all([requestOne, requestTwo, requestThree])
        .then(
          axios.spread((...responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];
            const responseThree = responses[2];

            setFiles(responseOne.data.Items);
            setLogs(responseTwo.data.Items);
            setPresignedDownloadUrl(responseThree.data);
            setLoading(false);
          })
        )
        .catch((errors) => {
          console.error(errors);
        });

      /*axios({
        method: "post",
        url:
          "https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getUploadURL",
        headers: {},
        data: {
          user: "Laurens",
          api: "PXW64JdS4dP2HJNQFt9D",
          fileName: "testFile.jpg",
        },
      });*/
    }
    fetchData();
  }, [selectedLog, downloadUrl, hasGivenUuid]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onChangeHandler = (event) => {
    setDownloadUrl(event.target.value);
    setCopied(false);
  };

  function handleUserClick(item) {
    setSelectedLog(item.DocID);
  }

  function handleDownloadUrlCLick() {
    setHasGivenUuid(true);
  }

  return (
    <div>
      <ReactTooltip />
      <Container
        style={{ textAlign: "center", marginTop: "2%", marginBottom: "2%" }}
      >
        <h1 style={{ color: "blue" }}>ICT Architectuur - Groep 1</h1>
      </Container>
      <CardGroup>
        <Card>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Get upload URL</Form.Label>
                <Form.Control
                  placeholder="Enter filename"
                  onChange={onChangeHandler}
                />
                <Button
                  variant="primary"
                  onClick={handleShow}
                  style={{ marginTop: "3%" }}
                >
                  Get upload URL
                </Button>
                <br />
                <Form.Label style={{ fontWeight: "bold", marginTop: "5%" }}>
                  Presigned upload URL:
                </Form.Label>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Get download URL</Form.Label>

                <Form.Group controlId="formUUIDDownload">
                  <Form.Control
                    placeholder="Enter UUID"
                    onChange={onChangeHandler}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleDownloadUrlCLick}>
                  Get download URL
                </Button>
                <Form.Group
                  controleId="formChecksumDownload"
                  style={{ marginTop: "5%" }}
                >
                  <Form.Label style={{ fontWeight: "bold" }}>
                    Presigned download URL:
                  </Form.Label>

                  <CopyToClipboard
                    text={
                      presignedDownloadUrl.url === undefined &&
                      presignedDownloadUrl.url === null
                        ? " "
                        : presignedDownloadUrl.url
                    }
                    onCopy={() => setCopied(true)}
                  >
                    <Button
                      variant="info"
                      style={{
                        visibility: `${hasGivenUuid ? "visible" : "hidden"}`,
                        marginLeft: "20px",
                      }}
                    >
                      Copy URL
                    </Button>
                  </CopyToClipboard>
                  <img
                    alt="greenmarker"
                    src={correct}
                    style={{
                      marginLeft: "25px",
                      width: "35px",
                      visibility: `${copied ? "visible" : "hidden"}`,
                    }}
                  />
                </Form.Group>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </CardGroup>
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
                  <th>Filename</th>
                  <th>UUID</th>
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
                  <th>Document ID</th>
                  <th>Log ID</th>
                  <th>Log time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((item, i) => (
                  <tr key={i}>
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
