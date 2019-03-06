import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import './TodoItem.css';
import 'normalize.css';
import './reset.css';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import UserDialog from './UserDialog'
import {getCurrentUser, signOut} from './leanCloud'

import AV from './leanCloud'
// 声明一个 Todo 类型
  var Todo = AV.Object.extend('Todo');
  // 新建一个 Todo 对象
  var todo = new Todo();
  todo.set('title', '工程师周会');
  todo.set('content', '每周工程师会议，周一下午2点');
  todo.save().then(function (todo) {
    // 成功保存之后，执行其他逻辑.
    console.log('New object created with objectId: ' + todo.id);
  }, function (error) {
    // 异常处理
    console.error(error);
  });


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: getCurrentUser||{},
      newTodo: '',
      todoList: []
    }
  }
  render() {
    let todos = this.state.todoList
      .filter((item) => !item.deleted)
      .map((item, index) => {
      return (
        <li key={index}>
          <TodoItem todo={item} onToggle={this.toggle.bind(this)}
            onDelete={this.delete.bind(this)}/>
        </li>
      )
    })
    return (
      <div className="App">
        <h1>{this.state.user.username||'我'}的待办
          {this.state.user.id ? <button onClick = {this.signOut.bind(this)}>登出</button> : null}
        </h1>
        <div>
          <TodoInput content={this.state.newTodo}
            onChange={this.changTitle.bind(this)}
            onSubmit={this.addTodo.bind(this)}/>
        </div>
        <ol className="todoList">
          {todos}
        </ol>
        {this.state.user.id ?
          null :
          <UserDialog
            onSignUp={this.onSignUpOrSignIn.bind(this)}
            onSignIn={this.onSignUpOrSignIn.bind(this)}/>}
      </div>
    );
  }
  signOut(){
    signOut()
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    this.setState(stateCopy)
  }
  onSignUpOrSignIn(user){
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    this.setState(stateCopy)
  }
  componentDidUpdate(){
  }
  toggle(e, todo){
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)
  }
  changTitle(event){
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })
  }
  addTodo(event){
    this.state.todoList.push({
      id: idMaker(),
      title: event.target.value,
      status: null,
      deleted: false
    })
    this.setState({
      newTodo: '',
      todoList: this.state.todoList
    })
  }
  delete(event, todo){
    todo.deleted = true
    this.setState(this.state)
  }
}

export default App;
let id = 0

function idMaker(){
  id += 1
  return id
}
