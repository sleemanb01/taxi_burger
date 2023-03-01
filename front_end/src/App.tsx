import { Suspense, useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import LandingPage from "./FC/pages/util/LandingPage";
import { useStocks } from "./hooks/useStocks";
import { AuthContext } from "./hooks/auth-context";
import { GetRoutes } from "./util/GetRoutes";
import NavTabs from "./FC/components/util/Navigation/NavTabs";
import ResponsiveAppBar from "./FC/components/util/Navigation/ResponsiveAppBar";
import LoadingSpinner from "./FC/components/util/UIElements/LoadingSpinner";
import { RTL } from "./FC/pages/util/RTL";

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const { user, login } = useContext(AuthContext);

  const stocksWActions = useStocks();
  // const assignmentsWActions = useAssignments();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      login(user);
    }
  }, [login]);

  useEffect(() => {
    const toRef = setTimeout(() => {
      setShowLandingPage(false);
      clearTimeout(toRef);
    }, 2000);
  }, []);

  if (showLandingPage) {
    return <LandingPage />;
  }

  return (
    <Router>
      <RTL>
        <ResponsiveAppBar
          stocks={stocksWActions.values}
          clickHandler={stocksWActions.clickHandler}
        />
        <NavTabs isManager={user?.email === process.env.REACT_APP_MANAGER} />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner asOverlay />
              </div>
            }
          >
            <GetRoutes
              stocksWActions={stocksWActions}
              token={user?.token}
              // assignmentsWActions={assignmentsWActions}
            />
          </Suspense>
        </main>
      </RTL>
    </Router>
  );
}

export default App;
