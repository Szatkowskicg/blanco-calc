import "./TextButtonDefault.css";

const TextButton = ({ onClick, title, content}) => {
  return (
    <button onClick={onClick} className="text-button-def" title={title}>
      {content}
    </button>
  );
};

export default TextButton;