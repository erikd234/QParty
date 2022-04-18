import "./TopNavBar.css";
import NavLink from "./NavLink/NavLink";

function TopNavBar() {
  return (
    <div className='top-nav-bar-box'>
      <p className='top-nav-bar-logo'>QP</p>
      <NavLink linkText={"How it Works"} />
      <NavLink linkText={"Contact Us"} />
    </div>
  );
}

export default TopNavBar;
