import ItemInput from './ItemInput';
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Item from './Item';
import { useEffect, useState } from "react";
import {v4 as uuid} from "uuid"; 

const API_IP = process.env.REACT_APP_SHOPPING_LIZT_API_URL

export default function ShoppingList() {
    const [items, setItems] = useState([])

    useEffect(() => {
        fetch(API_IP)
            .then(res => res.json())
            .then((result) => {
            console.log(result)
            setItems(result)
        })
    }, [])

    return (
        <div>
            <ItemInput setItems={setItems} />
            <Box sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                <nav aria-label="secondary mailbox folders">
                    <List>
                        {
                            items.map(item => {
                                return <Item key={item.id} id={item.id} x name={item.name} amount={item.amount} isCheckedVal={item.isChecked} />
                        })}
                    </List>
                </nav>
            </Box>
        </div>
    );
}