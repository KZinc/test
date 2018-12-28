import React from 'react'
import style from './RenderInput.css'
import PropTypes from "prop-types";

export default class RenderInput extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        onFocus: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        found: PropTypes.number.isRequired,
    };
    static defaultProps = {
        placeholder: "ИНТЕЛЛЕКТУАЛЬНЫЙ ПОИСК по названию, артикулу, категории, свойству, производителю",
    };

    render() {
        const {onChange, placeholder, value, onFocus, found} = this.props;
        const showHelper = value ? value.length * 8 + 20 : null;
        return (
            <div className={style['input']}
            >
                <input
                    type={'search'}
                    placeholder={placeholder}
                    onFocus={() => {
                        onFocus();
                    }}
                    onChange={(e) => {
                        onChange(e.target.value)
                    }}
                />
                {
                    showHelper ?
                        <div className={style['helper_text']} style={{left: showHelper}}>-
                            найдено {found} товаров</div>
                        :
                        null
                }
            </div>
        )
    }
}