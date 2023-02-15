import logo from "../../logo.svg";

import "../../styles/css/global.css";

function LandingPage() {
  return (
    <div className={"landing-page__overlay"}>
      <img style={{ width: "60%" }} src={logo} alt="app logo" />
    </div>
  );
}

export default LandingPage;
