import logo from "../../logo.svg";

import "../../styles/styles.css";

function LandingPage() {
  return (
    <div className={"landing-page__overlay"}>
      <img style={{ width: "100%" }} src={logo} alt="app logo" />
    </div>
  );
}

export default LandingPage;
