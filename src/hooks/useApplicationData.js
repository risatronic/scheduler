import { useState, useEffect } from "react";
const axios = require('axios');

export default function useApplicationData(){
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      setState(prev =>
        ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }));
    })
  }, []);

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const promise = axios
      .put(`/api/appointments/${id}`, appointment)
      .then(res => { 
        setState({...state, appointments});
        return true;
      })
      .catch(err => {
        console.log('axios.put error:', err);
        return false;
      });

    return promise;
  }

  const cancelInterview = function(id){
    const appointment = { key: id, id, interview: null };
    appointment.interview = null;

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const promise = axios
      .delete(`/api/appointments/${id}`)
      .then(res => {
        setState({...state, appointments});
        return true;
      })
      .catch(err => {
        console.log('axios.delete error: ', err);
        return false;
      });

    return promise;
  }

  return { state, setDay, bookInterview, cancelInterview };
}