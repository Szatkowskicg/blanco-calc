import "./TextButtonTransparent.css"

const TextButtonTransparent = ({ onClick, title, content}) => {
    return (
        <button onClick={onClick} className="text-button-transparent" title={title}>
            {content}
        </button>
      );
}

export default TextButtonTransparent