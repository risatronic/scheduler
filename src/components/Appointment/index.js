import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import useVisualMode from "../../hooks/useVisualMode";

import "components/Appointment/styles.scss";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  /*below functions intentionally declared vs anonymous for 
  readability following mentor advice*/

  function confirm() {
    transition(CONFIRM);
  }

  function create() {
    transition(CREATE);
  }

  function edit() {
    transition(EDIT);
  }

  function save(name, interviewer, edit) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING, true);

    props.bookInterview(props.id, interview, edit)
      .then(res => {
        if (res) {
          transition(SHOW);
        } else {
          transition(ERROR_SAVE);
        }
      });
  }

  function deleteID() {
    transition(DELETING, true);
    
    props.cancelInterview(props.id)
      .then(res => {
        if (res) {
          transition(EMPTY);
        } else {
          transition(ERROR_DELETE, true);
        }
      })

  }

  return (
    <article
      className="appointment"
      data-testid="appointment"
    >
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={create} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onConfirm={confirm}
          onCancel={back}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
          edit={false}
        />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === CONFIRM && (
        <Confirm
          onConfirm={deleteID}
          message="Cancel this appointment?"
        />
      )}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
          edit={true}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save appointment."
          onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not cancel appointment."
          onClose={back}
        />
      )}
    </article>
  );
};