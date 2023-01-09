import React, { useEffect, useState } from "react";
import axios from "axios";
import { HOST, PROJECT_NAMES, ADD_TIMESHEET } from "../Constants/Constants";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

function Timesheet() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [projects, setprojects] = useState([]);
  const [show, setShow] = useState(false);
  const [start, setstart] = useState("");
  const [end, setend] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    const call = async () => {
      await axios
        .get(HOST + PROJECT_NAMES, {
          headers: { auth: "Rose " + localStorage.getItem("auth") },
        })
        .then((res) => {
          setprojects(res.data.res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    call();
  }, []);
  const [form, setform] = useState({
    employee: "",
    work: "",
    date: "",
    start: "",
    end: "",
    comments: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = form;
    newForm[name] = value;
    setform(newForm);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    let value1 = new Date(start)
      let startMonth, startDay;
      if(value1.getMonth()+1<10) {
        startMonth=`0${value1.getMonth()+1}`;
      } else {
        startMonth = value1.getMonth()+1;
      }
      if(value1.getDate()<10) {
        startDay = `0${value1.getDate()}`;
      } else {
        startDay = value1.getDate();
      }
      let date = `${value1.getFullYear()}-${startMonth}-${startDay}`
    axios
      .post(
        HOST + ADD_TIMESHEET,
        {
          work: form.project,
          employeeId: localStorage.getItem("employeeId"),
          date: date,
          startTime: `${new Date(start).getHours()}:${new Date(
            start
          ).getMinutes()}:00`,
          endTime: `${new Date(end).getHours()}:${new Date(
            end
          ).getMinutes()}:00`,
          comments: form.comments,
        },
        { headers: { auth: "Rose " + localStorage.getItem("auth") } }
      )
      .then((res) => {
        if (res.data.success) {
          handleShow();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  var d = new Date();
  var offset = d.getTimezoneOffset();
  var hours = Math.floor(Math.abs(offset) / 60);
  var minutes = Math.abs(offset) % 60;
  if (minutes === 0) {
    minutes = "00";
  }
  var sign = offset > 0 ? "-" : "+";
  let offset1 = `${sign}0${hours}:${minutes}`;
  const handleChange1 = (e) => {
    let newValue = e.target.value + ":00" + offset1;
    setstart(newValue);
  };
  const handleChange2 = (e) => {
    let newValue = e.target.value + ":00" + offset1;
    setend(newValue);
  };
  return (
    <div>
      <Form className="form-main">
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>
              <b>Project</b>
            </Form.Label>
            <Form.Select onChange={handleChange} name="project" required>
              <option value="">Select a Project*</option>
              {projects.length !== 0 ? (
                projects.map((option) => (
                  <option value={option.Project_Name}>
                    {option.Project_Name}
                  </option>
                ))
              ) : (
                <option value="">None</option>
              )}
            </Form.Select>
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>
              <b>Start Time</b>
            </Form.Label>
            <Form.Control
              name="start"
              type="datetime-local"
              onChange={handleChange1}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>
              <b>End Time</b>
            </Form.Label>
            <Form.Control
              name="end"
              type="datetime-local"
              onChange={handleChange2}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="comments"
              type="text"
              placeholder="Comments"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Button
          className="submit-btn"
          variant="primary"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Form>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Form Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>Added To Timesheet Successfully</Modal.Body>
      </Modal>
    </div>
  );
}

export default Timesheet;