import React from "react";

import { render, cleanup, fireEvent } from "@testing-library/react";

import Form from "components/Appointment/Form";
import { action } from "@storybook/addon-actions/dist/preview";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without crashing", () => {
    render(<Form interviewers={interviewers} />);
  });

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form 
      interviewers={interviewers} 
      name="Lydia Miller-Jones" 
      />
    );

    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form 
        interviewers={interviewers}
        interviewer={1} 
      />
    );
    
    fireEvent.click(getByText("Save"));
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that an intervewer is selected", () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form 
        interviewers={interviewers}
        name="Lydia Miller-Jones"
      />
    );
    
    fireEvent.click(getByText("Save"));
    expect(getByText(/must select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
  
  /*changed provided test to validate interviewer selection as well as student name
     as you shouldn't logically book an appointment without both*/
  it("calls onSave function when the name and interviewer are defined", () => {
    const onSave = jest.fn();
    const { queryByText, getByText } = render(
      <Form 
        interviewers={interviewers} 
        name="Lydia Miller-Jones"
        interviewer={1}
        onSave={onSave} 
        edit={false}
      />
    );
    
    fireEvent.click(getByText("Save"));
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1, false);
  });
});