

import React from 'react'
import style from './ContextMenu.css'
import PropTypes from 'prop-types'
import {openPopup} from "./../popupHelper";

export default function openContextMenu(e, popupProps = {}) {
    debugger;
    if(!popupProps.width) popupProps.width = e.target.clientWidth;
    openPopup(ContextMenu, popupProps, undefined, e.target, {shiftMethod: true})
}

class ContextMenu extends React.Component {

    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string.isRequired,
            action: PropTypes.func,
        }),),
        width: PropTypes.number.isRequired,
    };
    static defaultProps = {};
    state = {};
    renderLines = (items) => {
        return items.map((line,num) => {
            return (
                <div key={`elem_${num}`}
                     className={style['line_wrapper']}
                     onClick = {() => {line.action()}}>
                    {line.text}
                </div>
            )
        })
    };
    render() {
        const {items, width} = this.props;
        if(!items || !Array.isArray(items)) return null;
        return (
            <div className={style['container']} style={{width:`${width}px`}}>
                {this.renderLines(items)}
            </div>
        )
    }
}