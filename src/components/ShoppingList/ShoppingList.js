import ItemInput from '../ItemInput';
import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import { CircularProgress } from '@mui/material';
import './ShoppingList.css';
import { useSocket } from '../WebSocket/UseSocket';
import ItemsList from '../ItemsList';

const API_IP = process.env.REACT_APP_SHOPPING_LIZT_API_URL
const SHOPPING_LIST_ID = process.env.REACT_APP_SHOPPING_LIST_ID

export default function ShoppingList({ fireDeleteAnimationCallback }) {
    const socket = useSocket()
    const [items, setItems] = useState([])
    const [isApiLoading, setIsApiLoading] = useState(true)
    const [shouldDeleteButtonBeEnabled, setShouldDeleteButtonBeEnabled] = useState(items.find(item => item.isInBasket) !== undefined)
    const [itemsInBasketAmount, setItemsInBasketAmount] = useState(items.filter(item => item.isInBasket)?.length)

    useEffect(() => {
        socket.on('onItemsDelete', (items) => {
            setItems(items);
            setShouldDeleteButtonBeEnabled(items.find(item => item.isInBasket) !== undefined)
            setItemsInBasketAmount(items.filter(item => item.isInBasket)?.length);
            fireDeleteAnimationCallback()
        });

        socket.on('onItemAddedToBasket', (itemAddedToBasket) => {
            setItems((newItems) => {
                const itemToPutInBasket = newItems.find(item => item.id === itemAddedToBasket.id);
                itemToPutInBasket.isInBasket = itemAddedToBasket.isInBasket;
                setShouldDeleteButtonBeEnabled(newItems.find(item => item.isInBasket) !== undefined)
                setItemsInBasketAmount(newItems.filter(item => item.isInBasket)?.length);
                return [...newItems]
            })
        });

        return () => {
            socket.off('onItemsDelete');
            socket.off('onItemAddedToBasket');
        };
    }, [fireDeleteAnimationCallback, socket]);

    // GET: Items
    useEffect(() => {
        fetch(`${API_IP}shoppingList/items/${SHOPPING_LIST_ID}`)
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                setShouldDeleteButtonBeEnabled(result.find(item => item.isInBasket) !== undefined)
                setItemsInBasketAmount(result.filter(item => item.isInBasket)?.length);
                setIsApiLoading(false)
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
                setShouldDeleteButtonBeEnabled(result.find(item => item.isInBasket) !== undefined)
                setItemsInBasketAmount(result.filter(item => item.isInBasket)?.length);
                fireDeleteAnimationCallback()
                socket.emit('onItemsDelete', result);
            })
    }

    // PUT: Put item in basket 
    const putItemInBasket = (itemId, newIsInBasket) => {
        const newItems = items
        const itemToPutInBasket = newItems.find(item => item.id === itemId);
        itemToPutInBasket.isInBasket = newIsInBasket;
        setShouldDeleteButtonBeEnabled(newItems.find(item => item.isInBasket) !== undefined)
        setItemsInBasketAmount(newItems.filter(item => item.isInBasket)?.length);

        fetch(`${API_IP}items`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemToPutInBasket)
        })
            .then(() => {
                setItems([...newItems])
                socket.emit('onItemAddedToBasket', itemToPutInBasket);
            })
    }

    return (
        isApiLoading ? <CircularProgress /> :
            <div>
                <ItemInput items={items} setItems={setItems} deleteInBasketItemsCallback={deleteInBasketItems} shouldDeleteButtonBeEnabled={shouldDeleteButtonBeEnabled} itemsInBasketAmount={itemsInBasketAmount} />
                <Box sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                    <ItemsList items={items} putItemInBasket={putItemInBasket} />
                </Box>
            </div>
    );
}