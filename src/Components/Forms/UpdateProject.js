import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import { HOST, EMPLOYEE_NAMES, UPDATE_PROJECT } from "../Constants/Constants";

function UpdateProject(props) {
  let manager = props.row.Project_Manager;
  const [pName, setpName] = useState(props.row.Project_Name);
  const [dateCreated, setdateCreated] = useState(
    props.row.Date_Created ? props.row.Date_Created.substring(0, 10) : ""
  );
  const [timeline, settimeline] = useState(
    props.row.timeline ? props.row.timeline.substring(0, 10) : ""
  );
  const [pStage, setpStage] = useState(props.row.Project_Stage);
  const [pManager, setpManager] = useState(props.row.Project_Manager);
  const [team, setteam] = useState(props.row.Team_Members);
  const [skills, setskills] = useState(props.row.Skills_Required);
  const [manPower, setmanPower] = useState(props.row.Man_Power);

  const [isSubmit, setIsSubmit] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [employees, setemployees] = useState([]);
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

  const [form, setform] = useState({
    projectName: pName,
    dateCreated: dateCreated,
    timeline: timeline,
    projectStage: pStage,
    projectManager: pManager,
    team: team,
    skills: skills,
    manPower: manPower,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "projectName") {
      setpName(value);
    }
    if (name === "dateCreated") {
      setdateCreated(value);
    }
    if (name === "timeline") {
      settimeline(value);
    }
    if (name === "projectStage") {
      setpStage(value);
    }
    if (name === "projectManager") {
      setpManager(value);
    }
    if (name === "teamMembers") {
      setteam(value);
    }
    if (name === "skillsRequired") {
      setskills(value);
    }
    if (name === "manPower") {
      setmanPower(value);
    }
    const newForm = form;
    newForm[name] = value;
    setform(newForm);
  };
  let projectId = props.row.Project_ID

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    axios.post(
      HOST + UPDATE_PROJECT,
      {
        projectName: pName,
        dateCreated: dateCreated,
        timeline: timeline,
        projectStage: pStage,
        projectManager: pManager,
        teamMembers: DisplayValue ? DisplayValue.toString() : team,
        skillsRequired: skills,
        manPower: manPower,
        projectId: projectId,
      },
      { headers: { auth: "Rose " + localStorage.getItem("auth") } }
    ).then((res) => {
      console.log(res)
      if (res.data.success) {
        handleShow();
      }
    }).catch(e => console.log(e))
  };

  let teamData = team ? team.split(",") : "";
  let members = [];
  teamData &&
    teamData.map((e) => {
      members.push({
        label: e,
        value: e,
      });
    });

  let attendees = [];
  employees.map((e) => {
    attendees.push({
      label: e.Full_Name,
      value: e.Full_Name,
    });
  });
  let [DisplayValue, getValue] = useState();
  let doChange = (e) => {
    getValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  return (
    <>
      <Form className="form-main">
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              name="projectName"
              type="text"
              value={pName}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Date Created</Form.Label>
            <Form.Control
              value={dateCreated}
              type="date"
              name="dateCreated"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Timeline</Form.Label>
            <Form.Control
              value={timeline}
              onChange={handleChange}
              type="date"
              name="timeline"
            />
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Select
              onChange={handleChange}
              name="projectStage"
              defaultValue={props.row.Project_Stage}
            >
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
              defaultValue={members}
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
                  <option
                    selected={option.Name === manager}
                    value={option.Name}
                  >
                    {option.Name}
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
            <Form.Control
              name="skills"
              onChange={handleChange}
              value={skills}
              type="text"
              placeholder="Skills Required"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Control
              onChange={handleChange}
              value={manPower}
              name="manPower"
              type="text"
              placeholder="Manpower"
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
        <Modal.Body>Project Updated Successfully</Modal.Body>
      </Modal>
    </>
  );
}

export default UpdateProject;
