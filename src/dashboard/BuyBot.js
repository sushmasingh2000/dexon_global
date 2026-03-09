import { Mail } from "@mui/icons-material";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import highlight from "../assets/highligt.svg";
import logo from "../assets/logo.png";
import "../assets/style.css";
import { support_mail } from "../utils/APIRoutes";
import {
  FaFacebook,
  FaYoutube,
  FaTelegram,
  FaPinterest,
  FaTumblr,
  FaMedium,
} from "react-icons/fa";
// Font Awesome CDN (inserted in index.html or dynamically loaded separately)
const functionTOCopy = (value) => {
  copy(value);
  toast.success("Copied to clipboard!", { id: 1 });
};
const links = [
  {
    icon: <FaFacebook color="#1877F2" />,
    url: "https://www.facebook.com/bnbchainx/",
  }, // Facebook Blue
  {
    icon: <FaYoutube color="#FF0000" />,
    url: "https://www.youtube.com/@bnbchainx",
  }, // YouTube Red
  {
    icon: <FaTelegram color="#0088cc" />,
    url: "https://t.me/BNBCHAINXOFFICIAL",
  }, // Telegram Blue
  {
    icon: <FaPinterest color="#E60023" />,
    url: "https://www.pinterest.com/bnbchainx/",
  }, // Pinterest Red
  {
    icon: <FaTumblr color="#36465D" />,
    url: "https://www.tumblr.com/blog/bnbchainx",
  }, // Tumblr Navy
  {
    icon: <FaMedium color="#000000" />,
    url: "https://medium.com/@bnbchainx",
  }, // Medium Black
];
const BuyBot = () => {
  return (
    <section>
      <div className="main_pages">
        <div className="icon_img">
          <img src={highlight} alt="" className="highlighted highlight-1" />
          <img src={highlight} alt="" className="highlighted highlight-2" />
          <img src={highlight} alt="" className="highlighted highlight-3" />
          <img src={highlight} alt="" className="highlighted highlight-4" />
        </div>

        <img src={logo} alt="Buy Bot Logo" className="logo" />
        <h2>
          Welcome to <span>BNB Chainx</span>
        </h2>
        <p>Whether you're in e-commerce, trading, marketing,</p>

        <div className="btn_main">
          <a href="/login">Login Now</a>
        </div>

        <ul className="!text-white">
          {/* <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
          <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
          <li><a href="#"><i className="fa-brands fa-x-twitter"></i></a></li>
          <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li> */}
          <div className="!flex !flex-col !justify-center !items-center gap-2">
            <div>
              <Mail onClick={() => functionTOCopy(support_mail)} />{" "}
              <span
                className="!text-[11px]"
                onClick={() => functionTOCopy(support_mail)}
              >
                {support_mail}
              </span>
            </div>
            <div className="lg:px-6 flex flex-wrap justify-center gap-2">
              {links.map((item, index) => (
                <button
                  key={index}
                  onClick={() => window.open(item.url, "_blank")}
                  className="p-3 bg-white text-white rounded-full hover:bg-blue-600 transition-all duration-300 text-xl flex items-center justify-center shadow-md"
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>
        </ul>
      </div>
    </section>
  );
};

export default BuyBot;
