import React from 'react'
import style from './ItemPopup.css'
import {openPopup, removePopup} from "./../popupHelper";

export default function openItemPopup(e, popupProps = {}) {
    openPopup(ItemPopup, popupProps,undefined, e.target, {shiftMethod: true, autoClose:true})
}

class ItemPopup extends React.Component {

    closePopup = () => {
        removePopup(this.props.id);
    };

    render() {
        const {name, manufacturer, price} = this.props.item;
        return (
            <div className={style['container']}>
                <div className={style['exit']} onClick={() => {
                    this.closePopup()
                }}/>
                <div className={style['container_top']}>
                    <div className={style['image']}
                         title={'Эта лягушка символизирует любой товар в интерент-магазине'}/>
                    <div className={style['item_name']} title={`Наименование ${name}`}>{name}</div>
                </div>
                <div className={style['price']} title={`Цена: ${price}`}>Цена: {price}</div>
                <div className={style['manufacturer']} title={`Производитель :${manufacturer}`}>{manufacturer}</div>
                <div className={style['manufacturer']} title={'страна изготовитель - Китай'}>страна изготовитель -
                    Китай
                </div>
            </div>
        )
    }
}