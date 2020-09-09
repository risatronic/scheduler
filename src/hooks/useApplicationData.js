import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

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
      axios.get('/api/appointments'),
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

  const bookInterview = function (id, interview, edit) {
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
        if (!edit) {
          const days = state.days.map((day) => {
            const dayToReturn = { ...day };
            if (dayToReturn.appointments.includes(id)) {
              dayToReturn.spots--;
            }
            return dayToReturn;
          });
          setState({ ...state, days, appointments });
        } else {
          setState({ ...state, appointments });
        }
        return true;
      })
      .catch(err => {
        console.log('axios.put error:', err);
        return false;
      });

    return promise;
  }

  const cancelInterview = function (id) {
    const appointment = { ...state.appointments[id] };
    appointment.interview = null;

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const promise = axios
      .delete(`/api/appointments/${id}`)
      .then(res => {
        const days = state.days.map((day) => {
          const dayToReturn = { ...day };
          if (dayToReturn.appointments.includes(id)) {
            dayToReturn.spots++;
          }
          return dayToReturn;
        });

        setState({ ...state, days, appointments });
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