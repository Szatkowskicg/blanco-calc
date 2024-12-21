import { BsPlusCircle } from "react-icons/bs";
import "./AddButton.css"

const AddButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="add-button" title="Dodaj">
      <BsPlusCircle />
    </button>
  );
};

export default AddButton;