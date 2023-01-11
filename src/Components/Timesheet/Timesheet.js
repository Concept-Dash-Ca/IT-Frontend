import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { HOST, EMPLOYEE_NAMES, GET_TIMESHEET } from "../Constants/Constants";
import LoadingSpinner from "../Loader/Loader";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import Form from "react-bootstrap/Form";
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
      let value1 = new Date(item.Date)
      console.log(value1);
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
      let entryDate = `${value1.getFullYear()}-${startMonth}-${startDay}T`
      console.log(entryDate);
      arr.push({
        
        title: `${item.Work}:${item.Comments}`,
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedevent, setSelectedevent] = useState(false);

  const handleEventClick = (info) => {
    setSelectedevent(true);
    setSelectedEvent(info.event);
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
      <div className="container" style={{padding: '1rem',marginTop:'1rem',marginBottom:'1rem'}}>
        {selectedEvent && selectedevent && (
                          <div style={{textAlign:'center', border:'2px solid black', marginLeft:'40%', paddingBottom:'.5rem', width:'20rem'}}>
                            <p><b>{selectedEvent.title}</b></p>
                            <p>
                              Start Time: {selectedEvent.start.toLocaleString()}
                            </p>
                            <p>
                              End Time: {selectedEvent.end.toLocaleString()}
                            </p>
                            <Button onClick={()=>setSelectedevent(false)}>Close</Button>
                          </div>
                        )}
    <div style={{ width:'80rem'}}>
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridWeek"
      events={timesheet}
      headerToolbar={{
        left: "title",
      }}
      eventClick={handleEventClick}
    /></div></div>:''}</div>}
    </>
  );
}

export default Timesheet;
