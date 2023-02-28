import ItemInput from '../ItemInput/ItemInput';
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Item from '../Item';
import { useEffect, useState } from "react";
import { CircularProgress, Collapse, ListItemText } from '@mui/material';
import './ShoppingList.css';
import FlippingText from '../FlippingText/FlippingText';
import { useSocket } from '../WebSocket/UseSocket';
import { TransitionGroup } from 'react-transition-group';

const API_IP = process.env.REACT_APP_SHOPPING_LIZT_API_URL
const SHOPPING_LIST_ID = process.env.REACT_APP_SHOPPING_LIST_ID

export default function ShoppingList({ fireDeleteAnimationCallback }) {
    const socket = useSocket()
    const [items, setItems] = useState([])
    const [isApiLoaded, setIsApiLoaded] = useState(false)
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
        <div>
            <div id="loading" hidden={isApiLoaded}>
                <CircularProgress />
            </div>
            <div hidden={!isApiLoaded}>
                <ItemInput items={items} setItems={setItems} deleteInBasketItemsCallback={deleteInBasketItems} shouldDeleteButtonBeEnabled={shouldDeleteButtonBeEnabled} itemsInBasketAmount={itemsInBasketAmount} />
                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <List hidden={items.length === 0}>
                        <TransitionGroup>
                            {
                                items.map(item => (
                                    <Collapse>
                                        <Item key={item.id} id={item.id} x name={item.name} amount={item.amount} isInBasket={item.isInBasket} checkItemCallback={putItemInBasket} />
                                    </Collapse>
                                ))}
                        </TransitionGroup>
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