import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import About from "./components/About";
import Create from "./components/Create";
import Home from "./components/Home";
import Explore from "./components/Explore";
import Trips from "./components/Trips";
import NotFound from "./components/NotFound";
import Navigation from "./components/Navigation";
import Auth from "./components/Auth";
import './app.css'

function App() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchUser()
  }, [])

  function fetchUser() {
    fetch('/authorize')
      .then(r => r.json())
      .then(user => {
        if (!user.errors) {
          updateUser(user)
          console.log("working")
        }
        else updateUser(null)
      })
      .finally(() => setLoading(false))
  }

  if (loading) {
    return <></>;
  }

  function updateUser(user) {
    setUser(user)
  }

  if (!user) {
    return (
      <>
        <Navigation updateUser={updateUser} user={user} />
        <Switch>
          <Route exact path='/authentication'>
            <Auth updateUser={updateUser} />
          </Route>
          <Route exact path='/home'>
            <Home />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </>
    )
  }

  return (
    <>
      <Navigation updateUser={updateUser} user={user} />
      <div className="pages">
        <Switch>
          <Route exact path='/about'>
            <About />
          </Route>
          <Route exact path='/create'>
            <Create />
          </Route>
          <Route exact path='/home'>
            <Home />
          </Route>
          <Route exact path='/trips'>
            <Trips user={user} />
          </Route>
          <Route exact path='/explore'>
            <Explore />
          </Route>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  )
}

export default App;