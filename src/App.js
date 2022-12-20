import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ShoppingList from './components/ShoppingList/ShoppingList';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <div className="shopping-list">
          <ShoppingList />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
