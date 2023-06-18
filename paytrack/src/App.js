import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import NavigationBar from './components/navigationbar/NavigationBar'
import RoutesConfig from './routes/RoutesConfig'

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          {
            RoutesConfig.map(route => {
              return (
                route.path === '/' ?
                  <Route exact path={route.path} key={route.path} element={
                    <Navigate to={route.redirectPath} replace={true} />
                  } /> :
                  <Route exact path={route.path} key={route.path} Component={route.component} />
              )
            })
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
