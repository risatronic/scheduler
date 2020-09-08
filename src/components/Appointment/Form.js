import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";


export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [message, setMessage] = useState("");

  const edit = props.edit;

  const reset = function() {
    setName("");
    setInterviewer(null);
  }

  const cancel = function() {
    reset();
    props.onCancel();
  }

  const save = function() {
    props.onSave(name, interviewer, edit);
  }

  const error = function() {
    if (name === "") {
      setMessage("Student name cannot be blank");
    }
    if (interviewer === null) {
      setMessage("Must select an interviewer");
    }
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form
          autoComplete="off"
          onSubmit={event => event.preventDefault()}
        >
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => {
                setName(event.target.value);
                setMessage("");
              }
            }
            data-testid="student-name-input"
          />
          <div
            name="message"
            className="appointment__validation text--semi-bold"
          >
            {message}
          </div>
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={(event) => setInterviewer(event)}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button
            onClick={cancel}
            danger>
            Cancel
          </Button>
          <Button
            onClick={(name && interviewer) ? save : error}
            confirm>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}