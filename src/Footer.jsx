import './Footer.css'

function Footer(){
    return(
        <div className="footer">
            <p>&copy; SzwagierCalc {new Date().getFullYear()} Powered by Propixia</p>
        </div>
    );
}

export default Footer