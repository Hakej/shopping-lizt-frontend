import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react';
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
    const [vars, setVars] = useState(isInBasket ? itemInBasketVars : itemVars);

    function onButtonClick() {
        checkItemCallback(id, !isInBasket)
    }

    useEffect(() => {
        setVars(isInBasket ? itemInBasketVars : itemVars)
    }, [isInBasket])

    return (
        <CustomListItemButton
            onClick={onButtonClick}
            style={vars}>
            <ListItemText primary={name} />
            {amount}
        </CustomListItemButton>
    );
}