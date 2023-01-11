import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import ProjectIcon from "../../Images/project-icon.png";
import Modal from "react-bootstrap/Modal";
import AddTask from "../Forms/AddTask";
import { HOST, COUNT_PROJECTS, COUNT_EMPLOYEES, GET_TASKS } from "../Constants/Constants";
import TestDemo from "../Calendar/Calendar";
import Tasks from "../Tables/Tasks";

function Dashboard() {
//   const [show, setShow] = useState(false);
//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
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
      // await axios
      //   .get(HOST + GET_TASKS, {
      //     headers: { auth: "Rose " + localStorage.getItem("auth") },
      //   })
      //   .then((res) => {
      //     settasks(res.data.res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
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
        {<Tasks/>}
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
    </>
  );
}

export default Dashboard;
