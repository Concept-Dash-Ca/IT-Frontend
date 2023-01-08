import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate, useLocation } from "react-router-dom";
import { HOST, UPDATE_TASK } from "../Constants/Constants";
import Modal from "react-bootstrap/Modal";

function UpdateTask(props) {
  const [isSubmit, setIsSubmit] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [form, setform] = useState({
    title: "",
    priority: "",
    status: "",
    completed: "",
    assignedTo: "",
    description: "",
    startDate: "",
    dueDate: "",
    completedOn: "",
    attachments: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "completed") {
      setpercentComplete(value);
    }
    const newForm = form;
    newForm[name] = value;
    setform(newForm);
  };
  const [percentComplete, setpercentComplete] = useState(
    props.row.Percent_Completed
  );
  let taskId = props.row.Task_ID;
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    axios
      .post(
        HOST + UPDATE_TASK,
        {
          completedPercent: form.completed,
          id: taskId,
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
  // let value1 = new Date(props.row.Start_Date);
  // let startMonth, startDay;
  // if (value1.getMonth() < 10) {
  //   startMonth = `0${value1.getMonth()}`;
  // } else {
  //   startMonth = value1.getMonth();
  // }
  // if (value1.getDate() < 10) {
  //   startDay = `0${value1.getDate()}`;
  // } else {
  //   startDay = value1.getDate();
  // }
  // let start = `${value1.getFullYear()}-${startMonth}-${startDay}`;
  // console.log(start);
  // let value2 = new Date(props.row.Due_Date);
  // let dueMonth, dueDay;
  // if (value2.getMonth() < 10) {
  //   dueMonth = `0${value2.getMonth()}`;
  // } else {
  //   dueMonth = value2.getMonth();
  // }
  // if (value2.getDate() < 10) {
  //   dueDay = `0${value2.getDate()}`;
  // } else {
  //   dueDay = value2.getDate();
  // }
  // let due = `${value2.getFullYear()}-${dueMonth}-${dueDay}`;
  return (
    <div>
      <Form className="form-main">
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Title</Form.Label>
            <Form.Control
              disabled
              value={props.row.Title}
              name="title"
              type="text"
              placeholder="Title*"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Prioirty</Form.Label>
            <Form.Control
              disabled
              value={props.row.Priority}
              name="priority"
              type="text"
              placeholder="Priority"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Percent Completed</Form.Label>
            <Form.Control
              value={percentComplete}
              name="completed"
              type="number"
              placeholder="% Completed"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              disabled
              value={props.row.Start_Date?props.row.Start_Date.substring(0, 10):''}
              name="startDate"
              type="date"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              disabled
              value={props.row.Due_Date?props.row.Due_Date.substring(0, 10):''}
              name="dueDate"
              type="date"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Description</Form.Label>
            <Form.Control
              disabled
              value={props.row.Description}
              name="description"
              type="text"
              placeholder="Description"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Button
          className="submit-btn"
          variant="primary"
          type="submit"
          style={{}}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Form>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Form Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>Task Updated Successfully</Modal.Body>
      </Modal>
    </div>
  );
}

export default UpdateTask;
