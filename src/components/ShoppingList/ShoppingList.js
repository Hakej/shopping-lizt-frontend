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
const SHOPPING_LIST_ID = process.env.REACT_APP_SHOPPING_LIST_ID

export default function ShoppingList({ fireDeleteAnimationCallback }) {
    const [items, setItems] = useState([])
    const [isApiLoaded, setIsApiLoaded] = useState(false)

    // GET: Items
    useEffect(() => {
        fetch(`${API_IP}shoppingList/items/${SHOPPING_LIST_ID}`)
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                setIsApiLoaded(true)
            })
    }, [])

    // DELETE: Delete items in basket
    const deleteInBasketItems = () => {
        // If no items are in basket, don't delete anything
        if (!items.filter(item => item.isInBasket).length)
            return

        fetch(`${API_IP}shoppingList/deleteInBasketItems/${SHOPPING_LIST_ID}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                fireDeleteAnimationCallback()
            })
    }

    // PUT: Put item in basket 
    const putItemInBasket = (itemId, newIsInBasket) => {
        const itemToPutInBasket = items.find(item => item.id === itemId);
        itemToPutInBasket.isInBasket = newIsInBasket;

        fetch(`${API_IP}items`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemToPutInBasket)
        })
            .then(() => {
                setItems(items)
            })
    }

    return (
        <div>
            <div id="loading" hidden={isApiLoaded}>
                <CircularProgress />
            </div>
            <div hidden={!isApiLoaded}>
                <ItemInput items={items} setItems={setItems} deleteInBasketItemsCallback={deleteInBasketItems} />
                <Box sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                    <List hidden={items.length === 0}>
                        {
                            items.map(item => {
                                return <Item key={item.id} id={item.id} x name={item.name} amount={item.amount} isInBasket={item.isInBasket} checkItemCallback={putItemInBasket} />
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