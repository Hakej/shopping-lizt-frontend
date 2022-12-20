import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const API_IP = process.env.REACT_APP_SHOPPING_LIZT_API_URL
const ON_EMPTY_ITEM_NAME_ERROR_MESSAGE = "Name cannot be empty"

export default function ItemInput({ setItems }) {
    const [itemInputValue, setItemInputValue] = useState("")
    const [itemInputAmount, setItemInputAmount] = useState(1)
    const [isItemNameInvalid, setIsItemNameInvalid] = useState(false)
    const [invalidItemNameHelperText, setInvalidItemNameHelperText] = useState("")

    const validateInput = (inputToValidate) => {
        if (inputToValidate === "") {
            setIsItemNameInvalid(true)
            setInvalidItemNameHelperText(ON_EMPTY_ITEM_NAME_ERROR_MESSAGE)
            return false
        }
        else if (isItemNameInvalid && inputToValidate !== "") {
            setIsItemNameInvalid(false)
            setInvalidItemNameHelperText("")
        }
        return true
    }
    const handleItemInputValueChange = e => {
        validateInput(e.target.value)
        setItemInputValue(e.target.value)
    }

    const handleItemInputAmountChange = e => {
        setItemInputAmount(e.target.value);
    }

    const handleAddButtonClick = () => {
        if (!validateInput(itemInputValue))
            return

        const newItem = { name: itemInputValue, amount: itemInputAmount, isChecked: false }

        fetch(API_IP, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": newItem.name,
                "amount": newItem.amount,
                "isChecked": newItem.isChecked
            })
        })
            .then(res => res.json())
            .then((result) => {
                newItem.id = result.id
                setItems(prevItems => {
                    return [...prevItems, newItem]
                })
            })

        setItemInputValue("")
        setItemInputAmount(1)
    }

    const handleDeleteButtonClick = () => {
        fetch(`${API_IP}deleteCheckedItems`, {
            method: "DELETE",
        })
            .then(res => res.json())
            .then((result) => {
                setItems(result)
            })
    }

    return (
        <div>
            <TextField
                error={isItemNameInvalid}
                helperText={invalidItemNameHelperText}
                label="Item name"
                variant="standard"
                value={itemInputValue}
                onChange={handleItemInputValueChange} />
            <TextField
                label="Amount"
                type="number"
                variant="standard"
                InputProps={{
                    startAdornment: <InputAdornment position="start">x</InputAdornment>
                }}
                value={itemInputAmount}
                onChange={handleItemInputAmountChange}
                sx={{ width: '100%', maxWidth: 65 }}
            />
            <IconButton color="primary" aria-label="upload picture" component="label" onClick={handleAddButtonClick}>
                <AddIcon id="addButton" />
            </IconButton>
            <IconButton color="error" onClick={handleDeleteButtonClick}>
                <DeleteForeverIcon />
            </IconButton>
        </div>
    );
}