import { Suspense, useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { RTL } from "./FC/assest/RTL";
import ResponsiveAppBar from "./FC/components/ResponsiveAppBar";
import LandingPage from "./FC/assest/LandingPage";
import NavTabs from "./FC/components/NavTabs";
import LoadingSpinner from "./FC/assest/LoadingSpinner";
import { useStocks } from "./hooks/useStock";
import { AuthContext } from "./hooks/auth-context";
import { GetRoutes } from "./FC/assest/GetRoutes";

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const { user, login } = useContext(AuthContext);

  const stocksWActions = useStocks();

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
        <NavTabs user={user} />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner asOverlay />
              </div>
            }
          >
            <GetRoutes stocksWActions={stocksWActions} user={user} />
          </Suspense>
        </main>
      </RTL>
    </Router>
  );
}

export default App;
