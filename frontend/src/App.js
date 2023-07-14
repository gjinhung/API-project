import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignUpPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/SpotsPage"
import SpotDetails from "./components/SpotDetails";
import CreateSpotPage from "./components/CreateSpotPage";
import ManageSpotsPage from "./components/ManageSpotsPage";
import UpdateSpotPage from "./components/UpdateSpotPage"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/spots/new"
            exact>
            <CreateSpotPage />
          </Route>
          <Route path="/spots/:spotId/edit"
            exact>
            <UpdateSpotPage />
          </Route>
          <Route path="/spots/current"
            exact>
            <ManageSpotsPage />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
          </Route>
          <Route path='/'
            exact>
            <Spots />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;