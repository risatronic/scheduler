import React from "react";
import "components/DayListItem.scss";

const classNames = require('classnames');

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  const formatSpots = function(spots) {
    let spotString;

    switch (spots) {
      case 0:
        spotString = "No spots remaining";
        break;
      case 1:
        spotString = "1 spot remaining";
        break;
      default:
        spotString = `${spots} spots remaining`;
        break;
    };
    return spotString;
  };


  return (
    <li
      className={dayClass}
      onClick={() => props.setDay(props.name)}
      selected={props.selected}
      full={props.full}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
