import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { HOST, EMPLOYEE_NAMES, ADD_TASK } from "../Constants/Constants";
import Modal from "react-bootstrap/Modal";

function AddTask() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [employees, setemployees] = useState([]);
  const [form, setform] = useState({
    title: "",
    priority: "",
    completed: "",
    assignedTo: "",
    description: "",
    startDate: "",
    dueDate: "",
    completedOn: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = form;
    newForm[name] = value;
    setform(newForm);
  };
  useEffect(() => {
    const call = async () => {
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
    };
    call();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    axios
      .post(
        HOST + ADD_TASK,
        {
          title: form.title,
          priority: form.priority,
          completedPercent: form.completed,
          assignedTo: form.assignedTo,
          description: form.description,
          startDate: form.startDate,
          dueDate: form.dueDate,
          completedOn: form.completedOn,
        },{ headers: { auth: "Rose " + localStorage.getItem("auth") } }
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          handleShow();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Form className="form-main">
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="title"
              type="text"
              placeholder="Title"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Control
              name="priority"
              type="text"
              placeholder="Priority"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="completed"
              type="number"
              placeholder="% Completed"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Assigned To</Form.Label>
            <Form.Select
              name="assignedTo"
              type="text"
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.length !== 0 ? (
                employees.map((option) => (
                  <option value={option.Employee_ID}>{option.Name}</option>
                ))
              ) : (
                <option value="">None</option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              name="startDate"
              type="date"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Due Date</Form.Label>
            <Form.Control name="dueDate" type="date" onChange={handleChange} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Completed On</Form.Label>
            <Form.Control
              name="completedOn"
              type="date"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
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
        <Modal.Body>Task Added Successfully</Modal.Body>
      </Modal>
    </div>
  );
}

export default AddTask;
