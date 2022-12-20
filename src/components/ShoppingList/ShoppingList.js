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

export default function ShoppingList() {
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

    return (
        <div>
            <div id="loading" hidden={isApiLoaded}>
                <CircularProgress />
            </div>
            <div hidden={!isApiLoaded}>
                <ItemInput items={items} setItems={setItems} />
                <Box sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                    <nav aria-label="secondary mailbox folders">
                        <List hidden={items.length === 0}>
                            {
                                items.map(item => {
                                    return <Item key={item.id} id={item.id} x name={item.name} amount={item.amount} isCheckedVal={item.isChecked} />
                                })}
                        </List>
                        <List hidden={items.length !== 0}>
                            <ListItemText>
                                <FlippingText text="Add item to show it here!"/>
                            </ListItemText>
                        </List>
                    </nav>
                </Box>
            </div>
        </div>
    );
}