import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Fib from './Fib';
import OtherPage from './otherPage';

function App() {
  return (
   <Router>
      <div className="App">
      <header >
        <Link to="/">Home</Link>
        <Link to="/otherPage">Other Page</Link>
      </header>

      <Route exact path ='/' component={Fib} />
      <Route exact path ='/otherpage' component={OtherPage} />
    </div>
   </Router>
  );
}

export default App;
