import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ShoppingList from './components/ShoppingList/ShoppingList';
import { useState } from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

var shoppingListClassName = "shoppingList"
var shoppingListDeleteAnimationClassName = "shoppingListDeleteAnimation"
var shoppingListClassNames = `${shoppingListClassName} ${shoppingListDeleteAnimationClassName}`

function App() {
  const [shoppingListClass, setShoppingListClass] = useState(shoppingListClassName);

  const fireDeleteAnimation = () => {
    setShoppingListClass(shoppingListClassName)
    setShoppingListClass(shoppingListClassNames)
    setTimeout(() => {
      setShoppingListClass(shoppingListClassName);
    }, 500)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <div className={shoppingListClass}>
          <ShoppingList fireDeleteAnimationCallback={fireDeleteAnimation} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
