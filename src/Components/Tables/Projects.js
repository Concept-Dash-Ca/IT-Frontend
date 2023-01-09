import { React, useEffect, useState } from "react";
import axios from "axios";
import {
  HOST,
  PROJECTS,
  COUNT_PROJECTS,
  SEACRH_PROJECTS
} from "../Constants/Constants";
import LoadingSpinner from "../Loader/Loader";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Table.css";
import UpdateProject from "../Forms/UpdateProject";
import ProjectForm from "../Forms/ProjectForm";

function Projects() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showUpdate, setShowUpdate] = useState(false);
  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = () => setShowUpdate(true);

  const [projects, setprojects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let d = 0;
  let limit = 30;
  const [pages, setpages] = useState(1);
  const [currPage, setcurrPage] = useState(1);
  useEffect(() => {
    setIsLoading(true);
    const call = async () => {
      await axios
        .get(HOST + PROJECTS, {
          headers: {
            auth: "Rose " + localStorage.getItem("auth"),
            limit: limit,
            offset: d,
          },
        })
        .then((res) => {
          setprojects(res.data.res);
        })
        .catch((err) => {
          console.log(err);
        });

      await axios
        .get(HOST + COUNT_PROJECTS, {
          headers: { auth: "Rose " + localStorage.getItem("auth"), limit: limit },
        })
        .then((res) => {
          setpages(res.data.res);
        })
        .catch((err) => {
          console.log(err);
        });

      setIsLoading(false);
    };
    call();
  }, []);
  const handlePage = async () => {
    setIsLoading(true);
    let current = currPage;
    setcurrPage(current + 1);
    await axios
      .get(HOST + PROJECTS, {
        headers: {
          auth: "Rose " + localStorage.getItem("auth"),
          limit: limit,
          offset: current * limit,
        },
      })
      .then((res) => {
        setprojects(res.data.res);
        console.log(res.data.res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlePagePre = async () => {
    setIsLoading(true);
    let current = currPage;
    setcurrPage(currPage - 1);
    await axios
      .get(HOST + PROJECTS, {
        headers: {
          auth: "Rose " + localStorage.getItem("auth"),
          limit: limit,
          offset: (current - 2) * limit,
        },
      })
      .then((res) => {
        setprojects(res.data.res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  const [value, setValue] = useState("");
  const filterData = async () => {
    setIsLoading(true);
    await axios
      .get(HOST + SEACRH_PROJECTS, {
        headers: {
          auth: "Rose " + localStorage.getItem("auth"),
          limit: limit,
          offset: 0,
          search: value,
        },
      })
      .then((res) => {
        setprojects(res.data.res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [rowData, setrowData] = useState([]);
  const handleUpdate = (e) => {
    setrowData(e);
    handleShowUpdate();
  };
  const inputData = (e) => {
    setValue(e.target.value);
  };
  
  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container-fluid">
          <h1
            style={{
              textAlign: "center",
              marginTop: "3rem",
              marginBottom: "1rem",
              fontFamily: "roboto",
              fontWeight: "bold",
            }}
          >
            Projects
            <Button
              onClick={handleShow}
              style={{ float: "right", backgroundColor: "rgba(38,141,141,1)" }}
            >
              Add Project +
            </Button>
          </h1>
          <div style={{ float: "right", marginBottom: "1rem" }}>
            <input
              style={{ marginRight: ".5rem" }}
              type="text"
              value={value}
              onChange={inputData}
              placeholder="Search"
            />
            <Button
              style={{ backgroundColor: "rgba(38,141,141,1)" }}
              size="sm"
              onClick={filterData}
            >
              Search
            </Button>
          </div>
          <br/>
          <div className="container-fluid">
            <table className="table">
              <thead>
                <tr className="heading">
                  <th scope="col">Edit</th>
                  <th scope="col">Project Name</th>
                  <th scope="col">Date Created</th>
                  <th scope="col">Timeline</th>
                  <th scope="col">Project Stage</th>
                  <th scope="col">Project Manager</th>
                  <th scope="col">Team Members</th>
                  <th scope="col">Skills Required</th>
                  <th scope="col">Man Power</th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                {projects.map((row) => {
                  return (
                    <tr>
                      <td>
                        <svg width="40" height="40" viewBox="30 0 220 220">
                          <image
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleUpdate(row);
                            }}
                            href="data:image/png;base64,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"
                          />
                        </svg>
                      </td>
                      <td>{row.Project_Name}</td>
                      <td>{row.Date_Created?row.Date_Created.substring(0, 10):''}</td>
                      <td>{row.Timeline?row.Timeline.substring(0, 10):''}</td>
                      <td>{row.Project_Stage}</td>
                      <td>{row.Project_Manager}</td>
                      <td>{row.Team_Members}</td>
                      <td>{row.Skills_Required}</td>
                      <td>{row.Man_Power}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            className="row justify-content-evenly"
            style={{ marginTop: "1rem", marginBottom: '1rem' }}
          >
            <div style={{ textAlign: "center" }} className="col-1">
              {currPage === 1 ? (
                <Button
                  style={{ backgroundColor: "rgba(53,187,187,1)" }}
                  disabled
                >
                  &lt;
                </Button>
              ) : (
                <Button
                  style={{ backgroundColor: "rgba(53,187,187,1)" }}
                  onClick={handlePagePre}
                >
                  &lt;
                </Button>
              )}
            </div>
            <div style={{ textAlign: "center" }} className="col-1">
              Page {currPage}/{pages}
            </div>
            <div style={{ textAlign: "center" }} className="col-1">
              {currPage === pages ? (
                <Button
                  style={{ backgroundColor: "rgba(53,187,187,1)" }}
                  disabled
                >
                  &gt;
                </Button>
              ) : (
                <Button
                  style={{ backgroundColor: "rgba(53,187,187,1)" }}
                  onClick={handlePage}
                >
                  &gt;
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Form Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        size="xl"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>{<ProjectForm />}</Modal.Body>
      </Modal>

      {/* Update Form Modal */}
      <Modal
        show={showUpdate}
        onHide={handleCloseUpdate}
        backdrop="static"
        size="xl"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>{<UpdateProject row={rowData} />}</Modal.Body>
      </Modal>
    </div>
  );
}

export default Projects;
