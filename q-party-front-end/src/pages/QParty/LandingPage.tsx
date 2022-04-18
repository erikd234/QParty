import TopNavBar from "../../components/TopNavBar/TopNavBar";
import "tailwindcss/tailwind.css";

function LandingPage() {
  return (
    <div>
      <TopNavBar></TopNavBar>
      <MiddleText />
    </div>
  );
}

function MiddleText() {
  return (
    <div className='w-12'>
      <h1>QParty</h1>
    </div>
  );
}

export default LandingPage;
