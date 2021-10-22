import { useState, useEffect } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import 'css/App.css'


function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(user);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      <header>
        <h1>보급형 진단장치</h1>
        <img src="Kepco.png" alt="kepco" style={{ marginRight: 2 }} />
      </header>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "initializing...."}
      <footer>&copy; {new Date().getFullYear()} Kepco</footer>
    </>
  );
}

export default App;
