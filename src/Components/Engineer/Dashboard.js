import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Modal from "react-bootstrap/Modal";
import AddTask from "../Forms/AddTask";
import Chart from "chart.js/auto";
import {
  HOST,
  TASKS_COUNT,
  PROJECTS_COUNT,
  WEEKLY_ANALYSIS,
} from "../Constants/Constants";
import TestDemo from "../Calendar/Calendar";
import { Pie } from "react-chartjs-2";

function Dashboard() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tasks, settasks] = useState([]);
  const [projects, setprojects] = useState([]);
  const [weekly, setweekly] = useState([]);

  const [upcoming, setupcoming] = useState(0);
  const [ongoing, setongoing] = useState(0);
  const [dead, setdead] = useState(0);
  const [completed, setcompleted] = useState(0);
  useEffect(() => {
    const call = async () => {
      await axios
        .get(HOST + TASKS_COUNT, {
          headers: { auth: "Rose " + localStorage.getItem("auth") },
        })
        .then((res) => {
          settasks(res.data.res);
          console.log(res.data.res);
        })
        .catch((err) => {
          console.log(err);
        });
      await axios
        .get(HOST + PROJECTS_COUNT, {
          headers: { auth: "Rose " + localStorage.getItem("auth") },
        })
        .then((res) => {
          setupcoming(res.data.res[0].Upcoming);
          setongoing(res.data.res[0].Ongoing);
          setdead(res.data.res[0].Dead);
          setcompleted(res.data.res[0].Completed);
        })
        .catch((err) => {
          console.log(err);
        });
      await axios
        .get(HOST + WEEKLY_ANALYSIS, {
          headers: { auth: "Rose " + localStorage.getItem("auth") },
        })
        .then((res) => {
          setweekly(res.data.res);
          console.log(res.data.res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    call();
  }, []);
  const data = [];
  const data1 = [];
  tasks.map((e) => {
    data.push({
      name: e.Name,
      "Tasks Pending": e.Tasks,
    });
  });
  weekly.map((e) => {
    data1.push({
      name: e.Name,
      "Hours Worked": e.Time_Worked / 60,
    });
  });
  const dataCounts = {
    labels: ["Upcoming", "Ongoing", "Dead", "Completed"],
    datasets: [
      {
        data: [upcoming, ongoing, dead, completed],
        backgroundColor: ["#9BBFE0", "#E8A09A", "#FBE29F", "#C6D68F"],
        hoverBackgroundColor: ["#74BBFB", "#74BBFB", "#74BBFB", "#74BBFB"],
      },
    ],
  };
  return (
    <>
      <Button style={{ float: "right", margin: ".5rem" }} onClick={handleShow}>
        Assign Task +
      </Button>
      <div
        style={{ marginTop: "2rem" }}
        className="container-fluid row justify-content-evenly"
      >
        <BarChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Tasks Pending" fill="#74BBFB" />
        </BarChart>
        <BarChart width={800} height={400} data={data1}>
          <CartesianGrid strokeDasharray="3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Hours Worked" fill="#E8A09A" />
        </BarChart>
        <div style={{ width: "32rem" }}>
          <Pie data={dataCounts} />
        </div>
      </div>
      <div
        className="container"
        style={{
          borderRadius: "1px",
          width: "50%",
          marginTop: "2rem",
          marginBottom: "2rem",
          "box-shadow":
            "1px 1px 1px 1px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.19)",
          backgroundColor: "#ffffff",
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
