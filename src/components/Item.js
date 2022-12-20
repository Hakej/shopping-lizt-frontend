import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { styled } from '@mui/material/styles';

const CustomListItemButton = styled(ListItemButton)({
    color: 'var(--color)',
    paddingLeft: 'var(--paddingLeft)',
});

const checkedVars = {
    '--color': 'gray',
    '--paddingLeft': '25px',
}
const uncheckedVars = {
    '--color': 'white',
    '--paddingLeft': '10px',
}

const API_IP = process.env.REACT_APP_SHOPPING_LIZT_API_URL

export default function Item({ id, name, amount, isChecked, checkItemCallback }) {
    const [isCheckedValue, setIsCheckedValue] = useState(isChecked)
    const [vars, setVars] = useState(isChecked ? checkedVars : uncheckedVars);

    function onButtonClick() {
        const newIsCheckedValue = !isCheckedValue
        setVars(newIsCheckedValue ? checkedVars : uncheckedVars)
        setIsCheckedValue(newIsCheckedValue)
        checkItemCallback(id, newIsCheckedValue)
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