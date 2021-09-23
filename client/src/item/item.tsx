import {Button} from '@material-ui/core'
// types
import {CartItemType} from '../App'
//styles
import {Wrapper} from './item.styles'
import React, {FC} from "react";

type Props = {
    item: CartItemType;
    handleAddToCart: (item: CartItemType) => void;
}

const Item: FC<Props> = ({item, handleAddToCart}) => {
    return (
        <Wrapper>
            <img src={item.image} alt={item.title}/>
            <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>{item.price}</p>
            </div>
            <Button onClick={() => handleAddToCart(item)} className={'btn'}>Add to cart</Button>
        </Wrapper>
    )
}

export default Item;
