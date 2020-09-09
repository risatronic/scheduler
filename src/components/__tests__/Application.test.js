import React from "react";
import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, 
  getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";
import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getAllByTestId(container, "appointment"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getAllByTestId(container, "appointment"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => 
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Cancel this appointment?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getAllByTestId(container, "appointment"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => 
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    const { container } = render(<Application />);
    const axiosReject = axios.put.mockRejectedValueOnce();

    await waitForElement(() => getAllByTestId(container, "appointment"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => 
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));
    
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    axiosReject(fireEvent.click(getByText(appointment, "Save")));
    
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Could not save appointment."));
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    const { container } = render(<Application />);
    const axiosReject = axios.delete.mockRejectedValueOnce();

    await waitForElement(() => getAllByTestId(container, "appointment"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => 
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Cancel this appointment?")).toBeInTheDocument();

    axiosReject(fireEvent.click(getByText(appointment, "Confirm")));

    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Could not cancel appointment."));
  });
});
