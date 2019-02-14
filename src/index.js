import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './index.css'

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputTextValue: "",
            modifyElementValue: "",
            list: [],
            showList: true,
            removeIndex: [],
            result: [],
            modifyElementList: [],
        }
        this.addToListOnClickHandle = this.addToListOnClickHandle.bind(this)
        this.textOnchangeHandle = this.textOnchangeHandle.bind(this)
        this.onKeyPressHandle = this.onKeyPressHandle.bind(this)
        this.removeElement = this.removeElement.bind(this)
        this.showList = this.showList.bind(this)
        this.removeAll = this.removeAll.bind(this)
        this.searchOnChangeHandle = this.searchOnChangeHandle.bind(this)
        this.deleteElement = this.deleteElement.bind(this)
        this.modifyElementMode = this.modifyElementMode.bind(this)
        this.modifyElementOnChange = this.modifyElementOnChange.bind(this)
        this.modifyElementOnClick = this.modifyElementOnClick.bind(this)
        this.exitModifyElement = this.exitModifyElement.bind(this)
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
            inputTextValue: '',
            modifyElementList: [...this.state.modifyElementList, 0]
        })
        document.getElementById("TextInput").focus()
    }

    onKeyPressHandle(e) {
        if (e.key === 'Enter' && this.state.inputTextValue !== '') {
            this.setState({
                list: [...this.state.list, this.state.inputTextValue],
                inputTextValue: '',
                modifyElementList: [...this.state.modifyElementList, 0]
            })
        }
    }

    removeElement() {
        let list = this.state.list,
            removeIndex = this.state.removeIndex,
            modifyElementList = this.state.modifyElementList
        list = list.map(function(element, index) {
            if (removeIndex.includes(index)) {
                document.getElementById(`checkbox ${index}`).checked = false
                document.getElementById(index).style.backgroundColor = "white"
                element = null
            }
            return element
        })
        modifyElementList = modifyElementList.map(function(element, index) {
            if (removeIndex.includes(index)) {
                element = null
            }
            return element
        })
        this.setState({
            list: list.filter(element => element !== null),
            removeIndex: [],
            modifyElementList: modifyElementList.filter(element => element !== null),
            modifyElementValue: "",
            result: []
        })
        document.getElementById("SearchInput").value = ""
    }

    removeAll() {
        this.setState({
            list: [],
            removeIndex: [],
            modifyElementList: [],
            result: []
        })
        document.getElementById("SearchInput").value = ""
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
        let list = this.state.list,
            modifyElementList = this.state.modifyElementList

        list.splice(index, 1)
        modifyElementList.splice(index, 1)
        document.getElementById(`checkbox ${index}`).checked = false
        document.getElementById(index).style.backgroundColor = "white"
        this.setState({
            list: list,
            modifyElementList: modifyElementList,
            modifyElementValue: "",
            result: []
        })
        document.getElementById("SearchInput").value = ""
    }

    modifyElementMode(index) {
        let modifyElementList = this.state.modifyElementList
        
        modifyElementList = modifyElementList.map((e, i) => i === index ? 1 : 0)
        this.setState({
            modifyElementList: modifyElementList,
            modifyElementValue: ""
        })
    }

    modifyElementOnChange(e) {
        this.setState({
            modifyElementValue: e.target.value
        })
    }

    modifyElementOnClick(index) {
        let list = this.state.list,
            modifyElementValue = this.state.modifyElementValue

        if (modifyElementValue !== "") {
            list[index] = modifyElementValue
            window.alert(`modify successfully`)
        }
        this.setState({
            list: list,
            modifyElementValue: "",
        })
    }

    exitModifyElement(index) {
        let modifyElementList = this.state.modifyElementList
        
        modifyElementList[index] = 0
        this.setState({
            modifyElementList: modifyElementList,
            modifyElementValue: "",
        })
    }

    //---------------------------------------------------------------------------------------------

    render() {
        const listDisplay = <ListDisplay 
            list={this.state.list}
            removeElement={this.removeElement} 
            removeAll={this.removeAll} 
            onChangeHandleCheckbox={this.onChangeHandleCheckbox.bind(this)}
            deleteElement={this.deleteElement}
            modifyElementList={this.state.modifyElementList}
            modifyElementMode = {this.modifyElementMode}
            modifyElementOnChange = {this.modifyElementOnChange}
            modifyElementOnClick = {this.modifyElementOnClick}
            modifyElementValue = {this.state.modifyElementValue}
            exitModifyElement = {this.exitModifyElement}
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

 //---------------------------------------------------------------------------------------------

const ListDisplay = props => {
    let modifyElementList = props.modifyElementList
    let display = props.list.map((element, index) => {
        if (modifyElementList[index] === 0) 
            return (
                <div className="Display" id={index} key={index} >
                    <pre onClick={() => props.modifyElementMode(index)}>
                        {index + 1}. {element}
                    </pre>
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
                </div>
            )
        else 
            return (
                <div className="Display" id={index} key={index}>
                    <input id="ModifyValueInput" value={props.modifyElementValue} onChange={props.modifyElementOnChange} />
                    <button id="ModifyButton" onClick={() => props.modifyElementOnClick(index)}>
                        Modify
                    </button>
                    <button id="ExitModifyButton" onClick={() => props.exitModifyElement(index)}>
                        Exit Modify
                    </button>
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
                </div>
            )
    })

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