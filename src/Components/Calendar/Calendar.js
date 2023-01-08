import FullCalendar, { preventDefault } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { gapi } from "gapi-script";
import { useState, useEffect } from "react";
import * as React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import axios from "axios";
import {
  HOST,
  EMPLOYEE_NAMES,
  PROJECT_NAMES,
  ADD_MEET,
} from "../Constants/Constants";
const TestDemo = () => {
  const [employees, setemployees] = useState([]);
  const [start, setstart] = useState("");
  const [end, setend] = useState("");
  const [projects, setprojects] = useState([]);
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
  let attendees = [];
  employees.map((e) => {
    attendees.push({
      label: e.Name,
      value: e.Employee_ID,
    });
  });
  let [DisplayValue, getValue] = useState();
  let doChange = (e) => {
      getValue(Array.isArray(e) ? e.map((x) => x.value) : []);
    };
  const SCOPES =
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";
  const handleClientLoad = () => {
    window.gapi.load("client:auth2", initClient);
  };
  const [events, setEvents] = useState(null);
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "https://apis.google.com/js/api.js";

    document.body.appendChild(script);

    script.addEventListener("load", () => {
      if (window.gapi) handleClientLoad();
    });
  }, []);
  const openSignInPopup = () => {
    localStorage.removeItem("access_token");
    window.gapi.auth2.authorize(
      {
        client_id:
          "52169325708-ujav1fof3lgebds8reurj0e74ua0tsgo.apps.googleusercontent.com",
        scope: SCOPES,
      },
      (res) => {
        if (res) {
          if (res.access_token)
            localStorage.setItem("access_token", res.access_token);

          // Load calendar events after authentication
          window.gapi.client.load("calendar", "v3", listUpcomingEvents);
        }
      }
    );
  };

  const initClient = () => {
    if (!localStorage.getItem("access_token")) {
      openSignInPopup();
    } else if (localStorage.getItem("access_token")) {
      // Get events if access token is found without sign in popup
      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=AIzaSyCD_8FIN6MsCjNbFY7GxOWxwDm7kmn-tX4&orderBy=startTime&singleEvents=true`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
        .then((res) => {
          // Check if unauthorized status code is return open sign in popup
          if (res.status !== 401) {
            return res.json();
          } else {
            localStorage.removeItem("access_token");

            openSignInPopup();
          }
        })
        .then((data) => {
          if (data?.items) {
            setEvents(formatEvents(data.items));
          }
        });
    }
  };
  const [form, setform] = useState({
    summary: "",
    project: "",
    employee: "",
    timeZone: "",
    description: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = form;
    newForm[name] = value;
    setform(newForm);
  };
  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const calendarID = "primary";
  const handleSubmit = (e) => {
    e.preventDefault();
    // setIsSubmit(true);
    console.log(new Date(start).toISOString());
    axios
      .post(
        HOST + ADD_MEET,
        {
          work: form.summary,
          employeeId: localStorage.getItem("employeeId"),
          date: new Date(start).toISOString().substring(0, 10),
          startTime: `${new Date(start).getHours()}:${new Date(
            start
          ).getMinutes()}:00`,
          endTime: `${new Date(end).getHours()}:${new Date(
            end
          ).getMinutes()}:00`,
          comments: form.description,
          attendees: DisplayValue.join(','),
        },
        { headers: { auth: "Rose " + localStorage.getItem("auth") } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addEvent = () => {
    function initiate() {
      gapi.client
        .request({
          path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events?conferenceDataVersion=1`,
          method: "POST",
          body: {
            conferenceDataVersion: 1,
            summary: `${form.summary}:${form.project}`,
            description: form.description,
            start: {
              dateTime: start,
            },
            end: {
              dateTime: end,
            },
            attendees: DisplayValue.map((email) => ({
              email: email.trim(),
            })),
            conferenceData: {
              createRequest: {
                conferenceSolutionKey: {
                  type: "hangoutsMeet",
                },
                requestId: makeid(20),
              },
            },
            reminders: {
              useDefault: true,
            },
          },
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then(
          (response) => {
            return [true, response];
            console.log(response);
          },
          function (err) {
            console.log(err);
            return [false, err];
          }
        );
    }
    gapi.load("client", initiate);
  };
  const listUpcomingEvents = () => {
    window.gapi.client.calendar.events
      .list({
        calendarId: "primary",
        showDeleted: true,
        singleEvents: true,
        timeMax: "2024-09-29T10:00:00+05:30",
        timeMin: "2021-10-26T13:00:00+05:30",
        maxResults: 500,
      })
      .then(function (response) {
        let events = response.result.items;
        if (events.length > 0) {
          setEvents(formatEvents(events));
        }
      });
  };
  const callFunc = (e) => {
    addEvent();
    handleSubmit(e);
  };
  const formatEvents = (list) => {
    return list.map((item) => ({
      title: item.summary,
      start: item.start.dateTime || item.start.date,
      end: item.end.dateTime || item.end.date,
      url: item.hangoutLink ? item.hangoutLink : item.iCalUID,
    }));
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  var d = new Date();
var offset = d.getTimezoneOffset();
var hours = Math.floor(Math.abs(offset) / 60);
var minutes = Math.abs(offset) % 60;
if(minutes===0) {
  minutes = '00'
}
var sign = (offset > 0) ? "-" : "+";
let offset1 = `${sign}0${hours}:${minutes}`
  const handleChange1 = (e) => {
      let newValue = e.target.value + ":00"+offset1;
      setstart(newValue);
    
  };
  const handleChange2 = (e) => {
      let newValue = e.target.value + ":00"+offset1;
      setend(newValue);
  };
  return (
    <>
      <Button
        onClick={handleShow}
        style={{
          marginTop: "1vh",
          textAlign: "center",
          backgroundColor: "lightgreen",
        }}
        variant="contained"
      >
        Create Event
      </Button>
      <div
        style={{
          width: "55rem",
        //   height: "50vh",
          paddingLeft: "1.7rem",
          paddingRight: "1.7rem",
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridWeek"
          events={events}
          headerToolbar={{
            left: "title",
          }}
          eventClick={(info) => {
            var eventObj = info.event;

            if (eventObj.url) {
              alert(
                "Clicked " +
                  eventObj.title +
                  ".\n" +
                  "Start time " +
                  eventObj.start +
                  ".\n" +
                  "End time " +
                  eventObj.end +
                  ".\n" +
                  "Will open the meet in a new tab"
              );

              window.open(eventObj.url);

              info.jsEvent.preventDefault(); // prevents browser from following link in current tab.
            } else {
              alert("Clicked " + eventObj.title);
            }
          }}
        />
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Select name="summary" onChange={handleChange}>
                <option>Select Meeting</option>
                <option value='Project Meeting'>Project Meeting</option>
                <option value='Client Meeting'>Client Meeting</option>
                <option value='Staff Meeting'>Staff Meeting</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Select
                isMulti
                onChange={doChange}
                options={attendees}
                name="employee"
                placeholder="Select Attendees"
              >
                Select Employees
              </Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                name="start"
                type="datetime-local"
                onChange={handleChange1}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                name="end"
                type="datetime-local"
                onChange={handleChange2}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                name="description"
                type="test"
                placeholder="Description"
                onChange={handleChange}
              />
            </Form.Group>
            <Button onClick={callFunc} variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default TestDemo;