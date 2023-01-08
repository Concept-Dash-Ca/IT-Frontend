import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import ProjectIcon from "../../Images/project-icon.png";
import Modal from "react-bootstrap/Modal";
import AddTask from "../Forms/AddTask";
import { HOST, COUNT_PROJECTS, COUNT_EMPLOYEES } from "../Constants/Constants";
import TestDemo from "../Calendar/Calendar";

function Dashboard() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [projectCount, setprojectCount] = useState(0);
  const [employeesCount, setemployeesCount] = useState(0);
  useEffect(() => {
    const call = async () => {
      await axios
        .get(HOST + COUNT_EMPLOYEES, {
          headers: { auth: "Rose " + localStorage.getItem("auth") },
        })
        .then((res) => {
          setemployeesCount(res.data.result[0].count);
          console.log(res.data.result[0].count);
        })
        .catch((err) => {
          console.log(err);
        });
      await axios
        .get(HOST + COUNT_PROJECTS, {
          headers: { auth: "Rose " + localStorage.getItem("auth") },
        })
        .then((res) => {
          setprojectCount(res.data.result[0].count);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    call();
  }, []);
  return (
    <>
      <div
        className="row d-flex justify-content-around body-1"
        style={{ marginTop: "2rem" }}
      >
        <div
          className="card col-3 d-flex align-items-center"
          style={{ width: "16rem", padding: "2rem" }}
        >
          <img src={ProjectIcon} className="card-img" alt="New Purchases" />
          <h5 className="card-title">Total Projects</h5>
          <p style={{ marginTop: "1rem" }}>
            <b>{projectCount}</b>
          </p>
        </div>
        <div
          className="card col-3 d-flex align-items-center"
          style={{ width: "16rem", padding: "2rem" }}
        >
          <img
            src={ProjectIcon}
            className="card-img"
            alt="Submitted Purchases"
          />
          <h5 className="card-title" align="center">
            Ongoing Projects
          </h5>
          <p style={{ marginTop: "1rem" }}>
            <b>2</b>
          </p>
        </div>
        <div
          className="card col-3 d-flex align-items-center"
          style={{ width: "16rem", padding: "2rem" }}
        >
          <img
            src={ProjectIcon}
            className="card-img"
            alt="Approved Purchases"
          />
          <h5 className="card-title">Employees Count</h5>
          <p style={{ marginTop: "1rem" }}>
            <b>{employeesCount}</b>
          </p>
        </div>
        <div
          className="card col-3 d-flex align-items-center"
          style={{ width: "16rem", padding: "2rem" }}
        >
          <img src={ProjectIcon} className="card-img" alt="Closed Purchases" />
          <h5 className="card-title">Assign Task</h5>
          <Button style={{ marginTop: "1rem" }} onClick={handleShow}>
            Assign
          </Button>
        </div>
      </div>
      <div
        className="container"
        style={{
          borderRadius: "1px",
          width: "50%",
          marginTop:'2rem',
          marginBottom:'2rem',
          "box-shadow":
            "1px 1px 1px 1px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.19)",
          "backgroundColor":'#ffffff'
        }}
      >
        <div style={{ textAlign: "center" }}>{<TestDemo />}</div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Task </Modal.Title>
        </Modal.Header>
        <Modal.Body>{<AddTask />}</Modal.Body>
      </Modal>
    </>
  );
}

export default Dashboard;
