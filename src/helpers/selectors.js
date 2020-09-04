export function getAppointmentsForDay(state, day) {
  let appointmentsForDay = [];
  const dayName = day;
  const selectedDay = state.days.filter(day => day.name === dayName)[0];

  if(!selectedDay){
    return appointmentsForDay;
  }
  
  for (const appointment of selectedDay.appointments) {
    appointmentsForDay.push(appointment);
  }

  appointmentsForDay = appointmentsForDay.map(appointment => state.appointments[appointment]);

  return appointmentsForDay;
};

export function getInterview(state, interview){
  if(!interview){
    return interview;
  }

  const interviewer = state.interviewers[interview.interviewer];
  const interviewToReturn = {
    student: interview.student,
    interviewer
  };

  return interviewToReturn;
}

export function getInterviewersForDay(state, day) {
  let interviewersForDay = [];
  const dayName = day;
  const selectedDay = state.days.filter(day => day.name === dayName)[0];

  if(!selectedDay){
    return interviewersForDay;
  }
  
  for (const interviewer of selectedDay.interviewers) {
    interviewersForDay.push(interviewer);
  }

  interviewersForDay = interviewersForDay.map(interviewer => state.interviewers[interviewer]);

  return interviewersForDay;
};