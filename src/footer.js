import './App.css';
import mail from "./mail.png"
import phone from "./phone.png"
import tg from "./tg.png"


export default function Footer() {

    return (
        <footer className="footer">
            <p className="footer-title">Морозова Алиса</p>
            <div className="footer-contacts">
                <div className="footer-row">
                    <img src={mail}/>
                    <a href="mailto:ariesyst@gmail.com">ariesyst@gmail.com</a>
                </div>
                <div className="footer-row">
                    <img src={tg}/>
                    <a href="https://t.me/alise_mor">@alise_mor</a>
                </div>
                <div className="footer-row">
                    <img src={phone}/>
                    <a href="tel:+79166136775">+7(916)613-67-75</a>
                </div>

            </div>
        </footer>
    )
}

