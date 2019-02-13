import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './index.css'

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputTextValue: '',
            list: [],
            showList: true,
            removeIndex: [],
            result: [],
        }
        this.addToListOnClickHandle = this.addToListOnClickHandle.bind(this)
        this.textOnchangeHandle = this.textOnchangeHandle.bind(this)
        this.onKeyPressHandle = this.onKeyPressHandle.bind(this)
        this.removeElement = this.removeElement.bind(this)
        this.showList = this.showList.bind(this)
        this.removeAll = this.removeAll.bind(this)
        this.searchOnChangeHandle = this.searchOnChangeHandle.bind(this)
        this.deleteElement = this.deleteElement.bind(this)
    }
    
    textOnchangeHandle(e) {
        this.setState({
            inputTextValue: e.target.value
        })
    }
    
    searchOnChangeHandle(e) {
        const list = this.state.list,
              inputValue = e.target.value
        let result = this.state.result
        result = []
        list.forEach((e, i) => {
            if (e.split(/\s/).join("").includes(inputValue.split(/\s/).join("")) ) {
                result = [...result, {index: i, element: e}]
            }
        })
        if (inputValue.trim() === "") result = []  
        this.setState({
            result: result
        })
    }

    addToListOnClickHandle() {
        if (this.state.inputTextValue === '') return document.getElementById("TextInput").focus()
        this.setState({
            list: [...this.state.list, this.state.inputTextValue],
            inputTextValue: ''
        })
        document.getElementById("TextInput").focus()
    }

    onKeyPressHandle(e) {
        if (e.key === 'Enter' && this.state.inputTextValue !== '') {
            this.setState({
                list: [...this.state.list, this.state.inputTextValue],
                inputTextValue: ''
            })
        }
    }

    removeElement() {
        let list = this.state.list,
            removeIndex = this.state.removeIndex
        list = list.map(function(element, index) {
            if (removeIndex.includes(index)) {
                document.getElementById(`checkbox ${index}`).checked = false
                document.getElementById(index).style.backgroundColor = "white"
                element = null
            }
            return element
        })
        this.setState({
            list: list.filter(element => element !== null),
            removeIndex: [],
        })
    }

    removeAll() {
        this.setState({
            list: [],
            removeIndex: [],
        })
    }

    showList() {
        this.setState({
            showList: !this.state.showList,
            removeIndex: [],
        })
    }

    onChangeHandleCheckbox(e, index) {
        if (e.target.checked) {
            this.setState({
                removeIndex: [...this.state.removeIndex, index]
            })
            document.getElementById(index).style.backgroundColor = "red"
        }
        else {
            document.getElementById(index).style.backgroundColor = "white"
            this.setState({
                removeIndex: this.state.removeIndex.filter(i => i !== index)
            })
        }
    }

    deleteElement(index) {
        let list = this.state.list

        list.splice(index, 1)
        document.getElementById(`checkbox ${index}`).checked = false
        document.getElementById(index).style.backgroundColor = "white"
        this.setState({
            list: list
        })
    }

    render() {
        const listDisplay = <ListDisplay 
            list={this.state.list}
            removeElement={this.removeElement} 
            removeAll={this.removeAll} 
            onChangeHandleCheckbox={this.onChangeHandleCheckbox.bind(this)}
            deleteElement={this.deleteElement}
        />
        const result = this.state.result
        return (
            <div className="Container" >
                <div className="TextInput" >
                    <h2>Add to list</h2>
                    <input type="text" id="TextInput"
                        value={this.state.inputTextValue}
                        onChange={this.textOnchangeHandle}
                        onKeyPress={this.onKeyPressHandle}
                    />
                    <button id="AddToListButton" onClick={this.addToListOnClickHandle}>Add to the list</button>
                    <br /> 
                    <button id="ShowListButton" onClick={this.showList}>Show List</button>
                    {this.state.showList === false ? null : listDisplay}
                </div>
                <hr/>
                <div className="SearchInput">
                    <h2>Search box</h2>
                    <input type="text" id="SearchInput" 
                        onChange={this.searchOnChangeHandle}
                    />
                    <h3>Result</h3>
                    {result.map((element, index) => 
                        <div className="Searchlist" key={`Search list ${index}`}>
                            {element.index + 1}. {element.element}
                        </div> 
                    )}
                </div>
            </div>
      )
    }
}

const ListDisplay = props => {
    const display = props.list.map((element, index) => 
        <div className="Display" id={index} key={index}>
            <pre>{index + 1}. {element}
            <input 
                className="Checkbox"
                id={`checkbox ${index}`}
                name="list"
                type="checkbox"
                onChange={(e) => props.onChangeHandleCheckbox(e, index)}
            />
            <button className="DeleteButton" onClick={() => props.deleteElement(index)}>
                Delete
            </button>
            </pre>
        </div>
    )

    return (
        <div className="ListDisplay">
            <h2>To do list</h2>
            <div>
                {display}
            </div> <br/>
            <button id="RemoveButton" onClick={props.removeElement}>Remove</button><br/>
            <button id="RemoveAllButton" onClick={props.removeAll}>Remove All</button>
        </div>
    )
}

ReactDOM.render(<Container />, document.getElementById('root'))