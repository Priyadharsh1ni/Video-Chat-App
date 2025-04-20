import './App.css';
import Router from './config/routeConfig';
import Socketv2 from './config/socketConfig';


function App() {
  return (
    <div className="App">
      <Router/>
      <Socketv2/>
    </div>
  );
}

export default App;
