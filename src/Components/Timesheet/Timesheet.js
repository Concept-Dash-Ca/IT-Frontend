import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { HOST, EMPLOYEE_NAMES, GET_TIMESHEET } from "../Constants/Constants";
import LoadingSpinner from "../Loader/Loader";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import Col from "react-bootstrap/Col";
import { Row } from "react-bootstrap";

function Timesheet() {
  const [isLoading, setisLoading] = useState(false);
  const [selected, setselected] = useState(false)
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

  const [timesheet, settimesheet] = useState([]);
  const handleChange1 = async (e) => {
    setisLoading(true);
    setselected(true)
    await axios
      .get(HOST + GET_TIMESHEET, {
        headers: {
          auth: "Rose " + localStorage.getItem("auth"),
          id: e.target.value,
        },
      })
      .then(async (res) => {
        settimesheet(formatEvents(res.data.res));
        console.log(res.data.res);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  let d = new Date();
  var offset = d.getTimezoneOffset();
  var hours = Math.floor(Math.abs(offset) / 60);
  var minutes = Math.abs(offset) % 60;
  if (minutes === 0) {
    minutes = "00";
  }
  var sign = offset > 0 ? "-" : "+";
  let offset1 = `${sign}0${hours}:${minutes}`;
  const formatEvents = (list) => {
    let arr = [];
    list.map((item) => {
      let date = new Date(item.Date);
      date.setDate(date.getDate()+1)
      let entryDate = date.toISOString();
      arr.push({
        
        title: `${item.Work}`,
        start: `${entryDate.substring(0, 11)}${item.Start_Time.substring(
          0,
          5
        )}${offset1}`,
        end: `${entryDate.substring(0, 11)}${item.End_Time.substring(
          0,
          5
        )}${offset1}`,
      });
    });

    return arr;
  };
  return (
    <>
    <h1 style={{ textAlign: "center", marginTop:'1rem', marginBottom:'1rem' }}>Select Employee</h1>
    <Form>
      <Form.Group as={Col}>
      <Form.Select style={{ marginBottom: "4vh" }} onChange={handleChange1}>
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
      </Form.Select></Form.Group></Form>
      {isLoading?<LoadingSpinner/>:
      <div>
      {selected?
      <div className="container" style={{padding: '1rem',marginTop:'1rem',marginBottom:'1rem', border:'2px solid black'}}>
      {/* <Button
      style={{ marginLeft: "40%", marginBottom: "2vh" }}
    >
      Add to TimeSheet
    </Button> */}
    <div style={{ width:'80rem'}}>
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridWeek"
      events={timesheet}
      headerToolbar={{
        left: "title",
      }}
      eventClick={(info) => {
        var eventObj = info.event;

        alert(
          "Clicked " +
            eventObj.title +
            ".\n" +
            "Start time " +
            eventObj.start +
            ".\n" +
            "End time " +
            eventObj.end +
            ".\n"
        );
      }}
    /></div></div>:''}</div>}
    </>
  );
}

export default Timesheet;
