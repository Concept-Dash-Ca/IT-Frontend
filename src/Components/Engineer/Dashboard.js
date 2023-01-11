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
  EMPLOYEE_NAMES,
  GET_TASKS,
} from "../Constants/Constants";
import TestDemo from "../Calendar/Calendar";
import { Pie } from "react-chartjs-2";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import LoadingSpinner from "../Loader/Loader";

function Dashboard() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [weekly, setweekly] = useState([]);

  const [upcoming, setupcoming] = useState(0);
  const [ongoing, setongoing] = useState(0);
  const [dead, setdead] = useState(0);
  const [completed, setcompleted] = useState(0);
  const [employees, setemployees] = useState([]);
  useEffect(() => {
    const call = async () => {
      setisLoading(true);
      await axios
        .get(HOST + EMPLOYEE_NAMES, {
          headers: { auth: "Rose " + localStorage.getItem("auth") },
        })
        .then((res) => {
          setemployees(res.data.res);
        })
        .catch((err) => {
          console.log(err);
        });
      // await axios
      //   .get(HOST + TASKS_COUNT, {
      //     headers: { auth: "Rose " + localStorage.getItem("auth") },
      //   })
      //   .then((res) => {
      //     settasks(res.data.res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
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
      setisLoading(false);
    };
    call();
  }, []);
  const data1 = [];
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
  const [taskbyid, settasksbyid] = useState(null);
  const [selected, setselected] = useState(false);
  const handleChange1 = async (e) => {
    setselected(true);
    await axios
      .get(HOST + GET_TASKS, {
        headers: {
          auth: "Rose " + localStorage.getItem("auth"),
          id: e.target.value,
        },
      })
      .then(async (res) => {
        settasksbyid(res.data.res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [isLoading, setisLoading] = useState(false)
  return (
    <>
      {isLoading?<LoadingSpinner/>:<div>
        <Button
          style={{ float: "right", margin: ".5rem" }}
          onClick={handleShow}
        >
          Assign Task +
        </Button>
        <div
          style={{ marginTop: "2rem" }}
          className="container-fluid row justify-content-evenly"
        >
          <BarChart width={800} height={400} data={data1}>
            <CartesianGrid strokeDasharray="3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Hours Worked" fill="#E8A09A" />
          </BarChart>
          <div style={{ width: "24rem" }}>
            <h2 style={{textAlign:'center'}}>Projects</h2>
            <Pie data={dataCounts} />
          </div>
        </div>
        <div
          className="container"
          style={{
            textAlign: "center",
            marginTop: "2rem",
            marginBottom: "2rem",
            border: "1px solid grey",
          }}
        >
          <h1>Tasks</h1>
          <h3>Select Employee</h3>
          <Form>
            <Form.Group as={Col}>
              <Form.Select
                style={{ marginBottom: "4vh" }}
                onChange={handleChange1}
              >
                <option>Select Employee</option>
                {employees.length !== 0 ? (
                  employees.map((options) => (
                    <option value={options.Employee_ID} key={options.Name}>
                      {options.Name}
                    </option>
                  ))
                ) : (
                  <option value="">None</option>
                )}
              </Form.Select>
            </Form.Group>
          </Form>
          {selected && taskbyid ? (
            <div className="container-fluid">
              <table className="table">
                <thead>
                  <tr className="heading">
                    <th scope="col">Title</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Percent Completed</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody class="table-group-divider">
                  {taskbyid.map((row) => {
                    return (
                      <tr>
                        <td>{row.Title}</td>
                        <td>{row.Priority}</td>
                        <td>{row.Percent_Completed}</td>
                        <td>
                          {row.Start_Date
                            ? row.Start_Date.substring(0, 10)
                            : ""}
                        </td>
                        <td>
                          {row.Due_Date ? row.Due_Date.substring(0, 10) : ""}
                        </td>
                        <td>{row.Description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )}
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
      </div>}
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
