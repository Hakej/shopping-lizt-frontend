import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { styled } from '@mui/material/styles';

const CustomListItemButton = styled(ListItemButton)({
    color: 'var(--color)',
    paddingLeft: 'var(--paddingLeft)',
});

const itemInBasketVars = {
    '--color': 'gray',
    '--paddingLeft': '25px',
}
const itemVars = {
    '--color': 'white',
    '--paddingLeft': '10px',
}

export default function Item({ id, name, amount, isInBasket, checkItemCallback }) {
    const [isInBasketValue, setIsInBasketValue] = useState(isInBasket)
    const [vars, setVars] = useState(isInBasket ? itemInBasketVars : itemVars);

    function onButtonClick() {
        const newIsInBasketValue = !isInBasketValue
        setVars(newIsInBasketValue ? itemInBasketVars : itemVars)
        setIsInBasketValue(newIsInBasketValue)
        checkItemCallback(id, newIsInBasketValue)
    }

    return (
        <CustomListItemButton
            onClick={onButtonClick}
            style={vars}>
            <ListItemText primary={name} />
            {amount}
        </CustomListItemButton>
    );
}