import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import { HOST, EMPLOYEE_NAMES, ADD_PROJECT } from "../Constants/Constants";

function ProjectForm() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [employees, setemployees] = useState([])
  useEffect(() => {
    const call = async () => {
      await axios
        .get(HOST + EMPLOYEE_NAMES, {
          headers: { auth: "Rose " + localStorage.getItem("auth") },
        })
        .then((res) => {
          setemployees(res.data.res);
          console.log(res.data.res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    call();
  }, []);
  const [form, setform] = useState({
    projectName: "",
    dateCreated: "",
    timeline: "",
    projectStage: "",
    projectManager: "",
    team: "",
    skills: "",
    manPower: "",
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
        HOST + ADD_PROJECT,
        {
          projectName: form.projectName,
          dateCreated: form.dateCreated,
          timeline: form.timeline,
          projectStage: form.projectStage,
          projectManager: form.projectManager,
          teamMembers: DisplayValue?DisplayValue.toString():"",
          skillsRequired: form.skills,
          manPower: form.manPower,
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
  let [DisplayValue, getValue] = useState();
  let doChange = (e) => {
    getValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  let attendees = [];
  employees.map((e) => {
    attendees.push({
      label: e.Name,
      value: e.Name,
    });
  });
  return (
    <>
      <Form className="form-main">
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="projectName"
              type="text"
              placeholder="Project Name"
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Date Created</Form.Label>
            <Form.Control type="date" name="dateCreated" />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Timeline</Form.Label>
            <Form.Control type="date" name="timeline" />
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Select name="projectStage" onChange={handleChange}>
              <option value="">Project Stage</option>
              <option value="Started">Started</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Dead">Dead</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Select
              isMulti
              onChange={doChange}
              options={attendees}
              name="team"
              placeholder="Team Members"
            >
              Team Members
            </Select>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Select name="projectManager" onChange={handleChange}>
              <option value="">Select Project Manager</option>
              {employees.length !== 0 ? (
                employees.map((option) => (
                  <option value={option.Name}>{option.Name}</option>
                ))
              ) : (
                <option value="">None</option>
              )}
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Control
              name="skills"
              type="text"
              placeholder="Skills Required"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Control name="manPower" type="text" onChange={handleChange} placeholder="Manpower" />
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
  );
}

export default ProjectForm;
