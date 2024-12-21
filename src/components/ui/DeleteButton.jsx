import { BsFillXCircleFill } from "react-icons/bs";
import "./DeleteButton.css"

const DeleteButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="delete-button" title="Usuń">
      <BsFillXCircleFill />
    </button>
  );
};

export default DeleteButton;