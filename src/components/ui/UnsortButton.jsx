import { FaFilterCircleXmark } from "react-icons/fa6";
import "./UnsortButton.css"

const UnsortButton = ({onClick}) => {
    return (
        <button onClick={onClick} className="reset-sort-button" title="Usuń sortowanie">
            <FaFilterCircleXmark />
        </button>
    );
}

export default UnsortButton