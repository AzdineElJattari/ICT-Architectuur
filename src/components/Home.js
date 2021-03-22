import React, { useState, useEffect } from "react";
import correct from "../images/correct.png";
import copy from "../images/copy.png";
import download from "../images/download.png";
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
      <td>{item.DocID} </td>
      <td>
        <CopyToClipboard text={item.DocID} onCopy={() => true}>
          <Button variant="primary" style={{ marginLeft: "20%" }}>
            <img src={copy} alt="copy image" />
          </Button>
        </CopyToClipboard>
      </td>
      <td>{item.checksum}</td>
      <td>{item.expDate}</td>
    </tr>
  </>
);

export default function Home() {
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [presignedDownloadUrl, setPresignedDownloadUrl] = useState({});
  const [selectedLog, setSelectedLog] = useState({});
  const [hasGivenUuid, setHasGivenUuid] = useState(false);
  const [uuid, setUuid] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [fileUploadSucces, setFileUploadSucces] = useState(false);

  useEffect(() => {
    async function fetchData() {
      var getFiles =
        "https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getFiles?user=Laurens&api=PXW64JdS4dP2HJNQFt9D";
      var getLogs = `https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getLogs?user=Laurens&api=PXW64JdS4dP2HJNQFt9D&id=${
        selectedLog === null ? " " : selectedLog
      }`;

      const requestOne = axios.get(getFiles).catch((err) => console.log(err));
      const requestTwo = axios.get(getLogs).catch((err) => console.log(err));
      const requestThree = axios
        .get(
          `https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getDownloadURL?user=Laurens&api=PXW64JdS4dP2HJNQFt9D&id=${downloadUrl}`
        )
        .catch((err) => console.log(err));

      axios
        .all([requestOne, requestTwo, requestThree])
        .then(
          axios.spread((...responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];
            const responseThree = responses[2];

            setFiles([...responseOne.data.Items]);
            setLogs([...responseTwo.data.Items]);
            setPresignedDownloadUrl(responseThree.data);
            setLoading(false);
          })
        )
        .catch((errors) => {
          console.error(errors);
        });
    }
    fetchData();
  }, [selectedLog, downloadUrl, hasGivenUuid]);

  //Download
  const handleUuidChange = (event) => {
    setUuid(event.target.value);
    setCopied(false);
    setHasGivenUuid(false);
  };

  function handleUserClick(item) {
    setSelectedLog(item.DocID);
  }

  function handleDownloadUrlCLick() {
    if (uuid.length === 0) {
      alert("Please make sure the UUID field is filled in!");
    } else {
      setDownloadUrl(uuid);
      setHasGivenUuid(true);
    }
  }

  //Upload
  function UploadObjectUsingPresignedURL() {
    var user = "Laurens";
    var api = "PXW64JdS4dP2HJNQFt9D";
    var file = document.getElementById("customFile").files[0];
    if (file === undefined) {
      alert("Please make sure to upload a file first");
    } else {
      var filename = file.name;
      var url =
        "https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getUploadURL?user=" +
        user +
        "&api=" +
        api +
        "&file=" +
        filename;
      var client = new HttpClient();
      client.get(url, function (response) {
        var body = JSON.parse(response);
        var presignedURL = body.url;
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", presignedURL, true);
        xhr.onload = () => {
          if (xhr.status === 200) {
            console.log("Succesfully uploaded!");
            setFileUploadLoading(true);
            setTimeout(function () {
              setFileUploadLoading(false);
              setFileUploadSucces(true);
              setTimeout(function () {
                setFileUploadSucces(false);
                window.location.reload();
              }, 1000);
            }, 2000);
          }
        };
        xhr.onerror = () => {
          console.log("An error has occured!");
        };
        xhr.send(file);

        axios
          .get(
            "https://ohpj90916c.execute-api.us-east-1.amazonaws.com/getFiles?user=Laurens&api=PXW64JdS4dP2HJNQFt9D"
          )
          .then((res) => {
            setFiles([...res.data.Items]);
          })
          .catch((err) => console.log(err));
      });
    }
  }

  var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
      var anHttpRequest = new XMLHttpRequest();
      anHttpRequest.onreadystatechange = function () {
        if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
          aCallback(anHttpRequest.responseText);
      };

      anHttpRequest.open("GET", aUrl, true);
      anHttpRequest.send(null);
    };
  };

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
                <Form.Label>Get upload URL for file</Form.Label>
                <br />
                <input
                  type="file"
                  id="customFile"
                  aria-describedby="customFile"
                  style={{ marginTop: "1%" }}
                />
                <br />

                <Button
                  variant="primary"
                  onClick={UploadObjectUsingPresignedURL}
                  style={{ marginTop: "3%" }}
                  type="button"
                  id="customFile"
                >
                  Upload file
                </Button>
                {fileUploadLoading ? (
                  <Spinner
                    animation="border"
                    variant="primary"
                    style={{
                      marginLeft: "5%",
                      marginTop: "3%",
                      position: "absolute",
                    }}
                  />
                ) : null}
                {fileUploadSucces ? (
                  <img
                    src={correct}
                    style={{
                      width: "5%",
                      marginLeft: "5%",
                      marginTop: "3.5%",
                      position: "absolute",
                    }}
                  />
                ) : null}
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
                    onChange={handleUuidChange}
                    value={uuid}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleDownloadUrlCLick}>
                  Retrieve download
                </Button>
                <Form.Group
                  controleId="formChecksumDownload"
                  style={{ marginTop: "5%" }}
                >
                  <a
                    className="btn btn-primary"
                    style={{
                      visibility: `${hasGivenUuid ? "visible" : "hidden"}`,
                    }}
                    href={
                      presignedDownloadUrl === undefined
                        ? "/"
                        : presignedDownloadUrl.url
                    }
                    target="_blank"
                  >
                    Download file
                    <img
                      alt="download icon"
                      src={download}
                      style={{}}
                      width={24}
                    />
                  </a>
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
                  <th>Copy UUID</th>
                  <th>Checksum</th>
                  <th>Expiry date</th>
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
                  <th>User</th>
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
