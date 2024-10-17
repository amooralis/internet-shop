import './App.css';
import mail from "./mail.png"
import phone from "./phone.png"
import tg from "./tg.png"


export default function Footer() {

    return (
        <footer className="footer">
            <p className="footer__title">Морозова Алиса</p>
            <div className="footer__contacts">
                <div className="footer__contacts__row">
                    <img src={mail} alt="почта"/>
                    <a href="mailto:ariesyst@gmail.com">ariesyst@gmail.com</a>
                </div>
                <div className="footer__contacts__row">
                    <img src={tg} alt="телеграмм"/>
                    <a href="https://t.me/alise_mor">@alise_mor</a>
                </div>
                <div className="footer__contacts__row">
                    <img src={phone} alt="телефон"/>
                    <a href="tel:+79166136775">+7(916)613-67-75</a>
                </div>
            </div>
        </footer>
    )
}

