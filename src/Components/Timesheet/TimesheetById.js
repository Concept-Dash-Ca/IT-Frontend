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
      let date = new Date(item.Date);
      // date.setDate(date.getDate()+1)
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
    <div>
      <Button
        onClick={handleShow}
        style={{ marginLeft: "40%", marginBottom: "2vh" }}
      >
        Add to TimeSheet
      </Button>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={event2}
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