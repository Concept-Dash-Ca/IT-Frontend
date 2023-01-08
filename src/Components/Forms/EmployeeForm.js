import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import { HOST, ADD_EMPLOYEE } from "../Constants/Constants";

function EmployeeForm() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [form, setform] = useState({
    department: "",
    name: "",
    email: "",
    username: "",
    password: ""
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
    axios
      .post(
        HOST + ADD_EMPLOYEE,
        {
          department: form.department,
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password
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
  return (
    <>
      <Form className="form-main">
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="department"
              type="text"
              placeholder="Department"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="password"
              type="password"
              placeholder="Passwrod"
              onChange={handleChange}
              required
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
        <Modal.Body>Project Added Successfully</Modal.Body>
      </Modal>
    </>
  )
}

export default EmployeeForm