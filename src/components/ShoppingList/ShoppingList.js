import ItemInput from '../ItemInput';
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Item from '../Item';
import { useEffect, useState } from "react";
import { CircularProgress, ListItemText } from '@mui/material';
import './ShoppingList.css';
import FlippingText from '../FlippingText/FlippingText';

const API_IP = process.env.REACT_APP_SHOPPING_LIZT_API_URL

export default function ShoppingList({ fireDeleteAnimationCallback }) {
    const [items, setItems] = useState([])
    const [isApiLoaded, setIsApiLoaded] = useState(false)

    // GET: Items
    useEffect(() => {
        fetch(API_IP)
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                setIsApiLoaded(true)
            })
    }, [])

    // DELETE: Checked items
    const deleteCheckedItems = () => {
        // If no items are checked, don't delete anything
        if (!items.filter(item => item.isChecked).length)
            return

        fetch(`${API_IP}deleteCheckedItems`, {
            method: "DELETE",
        })
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                fireDeleteAnimationCallback()
            })
    }

    // PUT: Check item
    const checkItem = (itemId, newIsChecked) => {
        fetch(API_IP + `checkItem/${itemId}/${newIsChecked}`, { method: "PUT" })
            .then(() => {
                const newItems = items
                newItems.find(item => item.id === itemId).isChecked = newIsChecked
                setItems(newItems)
            })
    }

    return (
        <div>
            <div id="loading" hidden={isApiLoaded}>
                <CircularProgress />
            </div>
            <div hidden={!isApiLoaded}>
                <ItemInput items={items} setItems={setItems} deleteCheckedItemsCallback={deleteCheckedItems} />
                <Box sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                    <List hidden={items.length === 0}>
                        {
                            items.map(item => {
                                return <Item key={item.id} id={item.id} x name={item.name} amount={item.amount} isChecked={item.isChecked} checkItemCallback={checkItem} />
                            })}
                    </List>
                    <List hidden={items.length !== 0}>
                        <ListItemText>
                            <FlippingText text="Add item to show it here!" />
                        </ListItemText>
                    </List>
                </Box>
            </div>
        </div>
    );
}