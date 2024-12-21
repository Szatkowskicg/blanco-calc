import "./DatePicker.css"
import React, { forwardRef } from 'react'
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";

const MyDatePicker = ({selectedValue, onDateChange}) => {
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="date-picker--custom-input" onClick={onClick} ref={ref}>
      {value}
    </div>
    ));

    // Sprawdźmy, czy przekazana wartość jest prawidłowym obiektem Date
    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    };

    return(
        <DatePicker
            selected={isValidDate(selectedValue) ? selectedValue : new Date()}
            onChange={(date) => onDateChange(date)}
            customInput={<CustomInput />}
            dateFormat="dd/MM/yyyy"
        />
    );
}

export default MyDatePicker