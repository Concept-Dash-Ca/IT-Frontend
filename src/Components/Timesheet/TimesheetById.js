import { React, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { HOST, GET_TIMESHEET } from "../Constants/Constants";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Timesheet from "../Forms/Timesheet";

function TimeSheetById() {
  const [event2, setevent2] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    const call = async () => {
      await axios
        .get(HOST + GET_TIMESHEET, {
          headers: {
            auth: "Rose " + localStorage.getItem("auth"),
            id: localStorage.getItem("employeeId"),
          },
        })
        .then(async (res) => {
          setevent2(formatEvents(res.data.res));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    call();
  }, []);
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
    <div>
      <Button
        onClick={handleShow}
        style={{ marginLeft: "40%", marginBottom: "2vh" }}
      >
        Add to TimeSheet
      </Button>
      {selectedEvent && selectedevent && (
                          <div style={{textAlign:'center', border:'2px solid black', marginLeft:'30%', paddingBottom:'.5rem', width:'20rem'}}>
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
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={event2}
        headerToolbar={{
          left: "title",
        }}
        eventClick={handleEventClick}
      />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        size="xl"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add to Timesheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>{<Timesheet/>}</Modal.Body>
      </Modal>
    </div>
  );
}

export default TimeSheetById;