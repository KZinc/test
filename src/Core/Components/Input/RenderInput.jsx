/**
 * Created by KZinc. 14.10.2018
 */

import React from 'react'
import style from './RenderInput.css'
import PropTypes from "prop-types";

export default class RenderInput extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,]),
        width:PropTypes.number,
        type: PropTypes.string,
        margin: PropTypes.string,
        name: PropTypes.string,
        items: PropTypes.array,
        error: PropTypes.bool,
    };
    static defaultProps = {
        placeholder: "Введите значение",
    };

    renderPicker(items) {
        const {onChange, name, value} = this.props;
        const optionsList = items.map((option, num) => {
            return (
                <option key={num} value={+option}>{option}</option>
            )
        });
        if(!+value) return null;
        return (
            <label className={style['common_label']}>
                {name}
                <select value={+value} onChange={(e) => {
                    onChange(e.target.value);
                }}>
                    {optionsList}
                </select>
            </label>)
    }

    render() {
        const {onChange, placeholder, value, name, items, width, margin} = this.props;
            let type = this.props.type;
        if (type === 'picker') {
            return this.renderPicker(items);
        }
        if(type === 'login') type = 'email';
        let propsStyle = {
            width:`${width}px`,
            margin,
        };
        return (
            <div className={style['input']}
            style={propsStyle}
            >
                {name ? name : null}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                    }}
                />
            </div>
        )
    }
}