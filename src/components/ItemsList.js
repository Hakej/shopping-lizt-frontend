import List from '@mui/material/List';
import Item from './Item';
import FlippingText from './FlippingText/FlippingText';
import { ListItemText } from '@mui/material';

export default function ItemsList({ items, putItemInBasket }) {
    return (
        items.length !== 0 ?
                <List>
                    {
                        items.map(item => {
                            return <Item key={item.id} id={item.id} x name={item.name} amount={item.amount} isInBasket={item.isInBasket} checkItemCallback={putItemInBasket} />
                        })}
                </List>
                :
                <List>
                    <ListItemText>
                        <FlippingText text="Add item to show it here!" />
                    </ListItemText>
                </List>
    )
}