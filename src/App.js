import React, {Component} from 'react';
import style from './App.css';
import RenderInput from "./Core/Components/Input/RenderInput";
import {getSearchString, searchList} from "./Core/listHelper";
import RenderListItem from "./Core/Components/List/RenderListItem";


class App extends Component {

    state = {
        items: searchList,
        value: null,
        app: null,
        showList: true,
    };

    componentDidMount() {
        this.setState({app: document.getElementById('app')});
        document.addEventListener('click', this.clickListener);
    }

    onSearchFocus = () => {
        this.setState({showList: true})
    };

    clickListener = (event) => {
        const showList = this.state.app.contains(event.target) || event.target.className.startsWith('ItemPopup');
        this.setState({showList})
    };

    changeField = (value) => {
        let timeOut = setTimeout((value) => {
            if (value === this.state.value) {
                let newItems = searchList.filter(item => {
                    let searchString = getSearchString(item);
                    return searchString.indexOf(value.toLowerCase()) > -1;
                });
                this.setState({items: newItems});
                clearTimeout(timeOut);
            }
        }, 2000, value);
        this.setState({value});
    };

    renderList = () => {
        return this.state.items.map(item => {
                let searchString = getSearchString(item);
                return (
                    <RenderListItem key={item.id} item={item} searchString={searchString}/>
                )
            }
        )
    };

    render() {
        const {value, showList, items} = this.state;
        const show = value && showList;
        return (
            <div className={style['main']} id={'app'}>
                <RenderInput
                    onChange={(value) => {
                        this.changeField(value)
                    }}
                    value={value}
                    found={items.length}
                    onFocus={() => {
                        this.onSearchFocus()
                    }}
                />
                {show ?
                    this.renderList()
                    : null
                }
            </div>

        );
    }
}

export default App;
