import React, { useState } from "react";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Projects from "../Tables/Projects";
import Timesheet from "../Timesheet/Timesheet";
import Tasks from "../Tables/Tasks";
import TimeSheetById from "../Timesheet/TimesheetById";

function Engineer() {
  const navigate = useNavigate();
  const [nav, setnav] = useState(1);

  const [showTS, setShowTS] = useState(false);
  const handleCloseTS = () => setShowTS(false);
  const handleShowTS = () => setShowTS(true);

  // const [showTasks, setShowTasks] = useState(false);
  // const handleCloseTasks = () => setShowTasks(false);
  // const handleShowTasks = () => setShowTasks(true);

  const handleDash = (e) => {
    if (nav === 1) return <Dashboard/>;
    if (nav === 2) return <Projects />;
    else if (nav === 3) return <Tasks />;
    else if (nav === 4) return <Timesheet/>;
  };

  return (
    <>
      <div class="s-layout">
        <Navbar
          bg="dark"
          expand="xl"
          style={{
            backgroundImage:
              "linear-gradient(to left,rgba(75,192,192,0.2) ,rgba(75,192,192,1)",
            color: "white",
          }}
        >
          <Container style={{ marginLeft: "2vw" }}>
            <Navbar.Brand
              onClick={(e) => {
                e.preventDefault();
                setnav(1);
              }}
              style={{ fontSize: "2rem" }}
              href="#home"
            >
              <b>TEAM DASHBOARD</b>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link
                  style={{ fontSize: "1rem", marginLeft: "2vw" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setnav(2);
                  }}
                >
                  <b>Projects</b>
                </Nav.Link>
                {/* <Nav.Link
                  style={{ fontSize: "1rem", marginLeft: "2vw" }}
                  onClick={handleShowTasks}
                >
                  <b>Tasks</b>
                </Nav.Link> */}
                <Nav.Link
                  style={{ fontSize: "1rem", marginLeft: "2vw" }}
                  onClick={handleShowTS}
                >
                  <b>TimeSheet</b>
                </Nav.Link>
                <Nav.Link
                  style={{ fontSize: "1rem", marginLeft: "2vw" }}
                  onClick={() => {
                    navigate("/");
                    localStorage.clear();
                  }}
                >
                  <b>Log Out</b>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <main class="s-layout__content1">{handleDash()}</main>
      </div>
      {/* TimeSheet Modal */}
      <Modal
        show={showTS}
        onHide={handleCloseTS}
        backdrop="static"
        size="lg"
        dialogClassName="modal-150w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title>Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ marginLeft: "0.5rem" }}>
          {<TimeSheetById />}
        </Modal.Body>
      </Modal>

      {/* Tasks Modal */}
    </>
  );
}

export default Engineer;
