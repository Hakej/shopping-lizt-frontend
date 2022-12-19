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

export default function Item({ id, name, amount, isCheckedVal = false }) {
    const [isChecked, setIsChecked] = useState(isCheckedVal === false ? false : true)
    const [vars, setVars] = useState(isChecked ? checkedVars : uncheckedVars);

    function onButtonClick() {
        const newIsChecked = !isChecked
        setIsChecked(newIsChecked)
        setVars(newIsChecked ? checkedVars : uncheckedVars)

        fetch(API_IP + `checkItem/${id}/${newIsChecked}`, { method: "PUT" })
            .then((result) => {
                console.log(result)
            })
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