import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './index.css'

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputTextValue: "", //input do người dùng nhập vào để add vào list
            modifyElementValue: "", // input do người dùng nhập, đây là giá trị mà người dùng muốn modify thành
            inputSearchValue: "",   // input do người dùng nhập, giá trị search
            list: [], // list to do 
            showList: true, // giá trị xem có muốn show list hay k, cũng đ để làm gì :v, cho vui
            removeIndex: [], // vị trí của những công việc mà người dùng muốn remove
            result: [], // kết quả tìm kiếm
            modifyElementList: [],  // 1 mảng sẽ fill toàn số 0, khi người dùng muốn modify 1 vị trí thì thì index chỗ đấy thành 1
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
    }
    
    textOnchangeHandle(e) { // cập nhật giá trị inputTextValue khi người dùng gõ 
        this.setState({
            inputTextValue: e.target.value
        })
    }
    
    searchOnChangeHandle(e) { // tìm kiếm khi có sự thay đổi của input (khi người dùng thay đổi input)
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
            result: result,
            inputSearchValue: inputValue,
        })
    }

    addToListOnClickHandle() {  // simple as its name, thêm vào list khi click
        let list = this.state.list,
            inputSearchValue = this.state.inputSearchValue

        if (this.state.inputTextValue === '') return document.getElementById("TextInput").focus()
        list = [...list, this.state.inputTextValue]
        this.setState({
            list: list,
            inputTextValue: '',
            modifyElementList: [...this.state.modifyElementList, 0],
            result: updateSearchList(list, inputSearchValue)
        })
        document.getElementById("TextInput").focus()
    }

    onKeyPressHandle(e) {   // khi ấn enter cũng có thể thêm vào list
        let list = this.state.list,
            inputSearchValue = this.state.inputSearchValue

        if (e.key === 'Enter' && this.state.inputTextValue !== '') {
            list = [...list, this.state.inputTextValue]
            this.setState({
                list: list,
                inputTextValue: '',
                modifyElementList: [...this.state.modifyElementList, 0],
                result: updateSearchList(list, inputSearchValue)
            })
        }
    }

    removeElement() {   // xóa những giá trị mà người dùng đã chọn
        let list = this.state.list,
            removeIndex = this.state.removeIndex,
            modifyElementList = this.state.modifyElementList,
            inputSearchValue = this.state.inputSearchValue

        list = list.map(function(element, index) {
                        if (removeIndex.includes(index)) {
                            document.getElementById(`checkbox ${index}`).checked = false
                            document.getElementById(index).style.backgroundColor = "white"
                            element = null
                        }
                        return element
                    }).filter(element => element !== null)
        modifyElementList = modifyElementList.map(function(element, index) {
                                                if (removeIndex.includes(index)) {
                                                    element = null
                                                }
                                                    return element
                                                }).filter(element => element !== null)
        this.setState({
            list: list,
            removeIndex: [],
            modifyElementList: modifyElementList,
            modifyElementValue: "",
            result: updateSearchList(list, inputSearchValue)
        })
    }

    removeAll() {   // xóa tất cả trong list
        this.setState({
            list: [],
            removeIndex: [],
            modifyElementList: [],
            result: []
        })
    }

    showList() {    //show list
        this.setState({
            showList: !this.state.showList,
            removeIndex: [],
        })
    }

    onChangeHandleCheckbox(e, index) {  // khi người dùng tick vào check box thì sẽ thay đổi về màu cho dễ nhìn
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

    deleteElement(index) {  // xóa công việc tại vị trí index
        let list = this.state.list,
            modifyElementList = this.state.modifyElementList,
            inputSearchValue = this.state.inputSearchValue

        list.splice(index, 1)
        modifyElementList.splice(index, 1)
        document.getElementById(`checkbox ${index}`).checked = false
        document.getElementById(index).style.backgroundColor = "white"
        
        this.setState({
            list: list,
            modifyElementList: modifyElementList,
            modifyElementValue: "",
            result: updateSearchList(list, inputSearchValue)
        })
    }

    modifyElementMode(index) {  // chuyển sang chế độ modify
        let modifyElementList = this.state.modifyElementList
        
        modifyElementList = modifyElementList.map((e, i) => i === index ? 1 : 0)
        this.setState({
            modifyElementList: modifyElementList,
            modifyElementValue: ""
        })
    }

    modifyElementOnChange(e) {  //  cập nhật giá trị modifyElementValue khi người dùng thay đổi input
        this.setState({
            modifyElementValue: e.target.value
        })
    }

    modifyElementOnClick(index) {   // khi click thì sẽ modify giá trị và thoát luôn chê độ modify
        let list = this.state.list,
            modifyElementValue = this.state.modifyElementValue,
            modifyElementList = this.state.modifyElementList,
            inputSearchValue = this.state.inputSearchValue

        if (modifyElementValue !== "") {
            list[index] = modifyElementValue
            modifyElementList[index] = 0
            this.setState({
                list: list,
                modifyElementValue: "",
                modifyElementList: modifyElementList,
                result: updateSearchList(list, inputSearchValue)
            })
        } 
        else {
            modifyElementList[index] = 0
            this.setState({
                modifyElementList: modifyElementList,
                modifyElementValue: "",
            })
        }
    }


    //---------------------------------------------------------------------------------------------

    render() {
        const listDisplay = <ListDisplay    // chuyền props cho class ListDisplay
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
        />
        const result = this.state.result

        return (
            <div className="Container" >   
                <div className="List" >    
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
                <div className="Search">
                    <h2>Search box</h2>
                    <input type="text" id="SearchInput" 
                        onChange={this.searchOnChangeHandle}
                    />
                    <h3>Result</h3>
                    {   
                        result.map((element, index) => 
                        <div className="Searchlist" key={`Search list ${index}`}>
                            {element.index + 1}. {element.element}
                        </div> 
                    )}
                    
                </div>
            </div>
      )
    }
}



const ListDisplay = props => {  // class chỉ để hiển thị list
    let modifyElementList = props.modifyElementList
    let display = props.list.map((element, index) => {
            return (
                <div className="Display" id={index} key={index} >
                    {modifyElementList[index] === 0 ? 
                        <>
                            <pre onClick={() => props.modifyElementMode(index)}>
                                {index  + 1}. {element}
                            </pre>
                        </>
                        :
                        <>
                            <pre>{index + 1}. {element}</pre>
                            <input id="ModifyValueInput" value={props.modifyElementValue} onChange={props.modifyElementOnChange} />
                            <button id="ModifyButton" onClick={() => props.modifyElementOnClick(index)}>
                                Modify
                            </button>
                        </>
                    }
                    
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

const updateSearchList = (list, inputSearchValue) => {  // function update lại kết quả tìm kiếm khi list bị thay đổi
    let result = []
    list.forEach((e, i) => {
        if (e.split(/\s/).join("").includes(inputSearchValue.split(/\s/).join("")) ) {
            result = [...result, {index: i, element: e}]
        }
    })
    if (inputSearchValue.trim() === "") result = []  
    return result
}

ReactDOM.render(<Container />, document.getElementById('root'))