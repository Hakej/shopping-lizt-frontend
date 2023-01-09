import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const API_IP = process.env.REACT_APP_SHOPPING_LIZT_API_URL
const ON_EMPTY_ITEM_NAME_ERROR_MESSAGE = "Name cannot be empty"

const SHOPPING_LIST_ID = process.env.REACT_APP_SHOPPING_LIST_ID

export default function ItemInput({ setItems, deleteInBasketItemsCallback }) {
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

    const handleAddButtonClick = () => {
        addItem();
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addItem();
        }
    }

    const addItem = () => {
        if (!validateInput(itemInputValue))
            return

        const newItem = { name: itemInputValue, amount: itemInputAmount, isInBasket: false }

        fetch(`${API_IP}shoppingList/addItem/${SHOPPING_LIST_ID}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": newItem.name,
                "amount": newItem.amount,
                "isInBasket": newItem.isInBasket
            })
        })
            .then(res => res.json())
            .then((result) => {
                newItem.id = result.id
                setItems((items) => {
                    return [...items, newItem]
                })
            })

        setItemInputValue("")
        setItemInputAmount(1)
    }

    const handleDeleteButtonClick = () => {
        deleteInBasketItemsCallback();
    }

    const handleRaiseAmountButtonClick = () => {
        setItemInputAmount(itemInputAmount + 1);
    }
    const handleLowerAmountButtonClick = () => {
        if (itemInputAmount === 1)
            return;
        setItemInputAmount(itemInputAmount - 1);
    }

    return (
        <div>
            <TextField
                id="nameInput"
                error={isItemNameInvalid}
                helperText={invalidItemNameHelperText}
                label="Item name"
                variant="standard"
                value={itemInputValue}
                onChange={handleItemInputValueChange}
                onKeyPress={handleKeyPress} />

            <IconButton id="raiseAmountButton" onClick={handleRaiseAmountButtonClick}>
                <ArrowUpwardIcon />
            </IconButton>
            {itemInputAmount}
            <IconButton id="lowerAmountButton" onClick={handleLowerAmountButtonClick} disabled={itemInputAmount === 1}>
                <ArrowDownwardIcon />
            </IconButton>

            <IconButton color="primary" onClick={handleAddButtonClick}>
                <AddIcon id="addButton" />
            </IconButton>
            <IconButton color="error" onClick={handleDeleteButtonClick}>
                <DeleteForeverIcon />
            </IconButton>
        </div>
    );
}