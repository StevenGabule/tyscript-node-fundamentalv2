import React, {useState} from 'react';
import {useQuery} from 'react-query'
import {Drawer, LinearProgress, Grid, Badge} from '@material-ui/core'
import {AddShoppingCart} from '@material-ui/icons'

import {Wrapper, StyleButton} from './App.style'
import Item from "./item/item";
import Cart from "./Cart/Cart";

// types
export type CartItemType = {
    id: number;
    category: string;
    description: string;
    price: number;
    image: string;
    title: string;
    amount: number;
}

const getProducts = async (): Promise<CartItemType[]> => {
    return await (await fetch(`https://fakestoreapi.com/products/`)).json();
}

function App() {
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([] as CartItemType[]);

    const {data, isLoading, error} = useQuery<CartItemType[]>('products', getProducts)

    function getTotalItems(items: CartItemType[]) {
        return items.reduce((acc: number, item) => acc + item.amount, 0)
    }

    function handleAddToCart(clickedItem: CartItemType) {
        setCartItems(prev => {
            const isItemCart = prev.find(item => item.id === clickedItem.id)
            if (isItemCart) {
                return prev.map(item => (
                    item.id === clickedItem.id
                        ? {...item, amount: item.amount + 1} : item
                ))
            }
            // first time the item is added
            return [...prev, {...clickedItem, amount: 1}]
        })
    }

    function handleRemoveFromCart(id: number) {
        setCartItems(prev => (
            prev.reduce((ack, item) => {
                if (item.id === id) {
                    if (item.amount === 1) return ack;
                    return [...ack, {...item, amount: item.amount - 1}];
                } else {
                    return [...ack, item]
                }
            }, [] as CartItemType[])
        ))
    }

    if (isLoading) return <LinearProgress/>
    if (error) return <div>Something goes wrong!</div>

    return (
        <Wrapper>
            <Drawer anchor={'right'} open={cartOpen} onClose={() => setCartOpen(false)}>
                <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart}/>
            </Drawer>
            <StyleButton onClick={() => setCartOpen(true)}>
                <Badge badgeContent={getTotalItems(cartItems)} color={'error'}>
                    <AddShoppingCart/>
                </Badge>
            </StyleButton>
            <Grid container spacing={3}>
                {data?.map((item) => (
                    <Grid item key={item.id} xs={12} sm={4}>
                        <Item item={item} handleAddToCart={handleAddToCart}/>
                    </Grid>
                ))}
            </Grid>
        </Wrapper>
    );
}

export default App;
