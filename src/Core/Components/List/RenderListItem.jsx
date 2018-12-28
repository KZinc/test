import React from 'react'
import style from './RenderListItem.css'
import openItemPopup from "../Popup/ItemPopup/ItemPopup";
import PropTypes from "prop-types";

export default class RenderListItem extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        searchString: PropTypes.string.isRequired,
    };

    renderLineDetails = (item) => {
        let properties = Object.keys(item);
        return properties.map((property, position) => {
            let text = item[property].toString();
            return (
                <div className={style[property]}
                     key={property}>
                    {text}
                    {position !== properties.length - 1 ? ',' : ''}
                </div>
            )
        })
    };

    render() {
        const {item, searchString} = this.props;
        return (
            <div className={style['normal']}
                 title={searchString}
                 onClick={(e) => {
                     openItemPopup(e, {item})
                 }}
            >
                <div className={style['small_image']}/>
                {this.renderLineDetails(item)}
            </div>
        )
    }
}