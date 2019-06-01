import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ITEMS_URL = 'https://elated-curie-04d801.netlify.com/.netlify/functions/server/items.json'
class App extends Component {

  state = {
    items: [],
    loading: true,
    todoItem: ''
  }

  componentDidMount() {
    fetch(ITEMS_URL)
    .then(response => response.json())
    .then(items => {
      this.setState({ items, loading: false })
    })
  }

  addItem = (e) => {
    e.preventDefault()

    fetch(ITEMS_URL, {
      method: 'POST',
      body: JSON.stringify({ item: this.state.todoItem }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(items => {
      this.setState({ items })
    })

    this.setState({ todoItem: '' })
  }

  deleteItem = (itemId) => {
    fetch(ITEMS_URL, {
      method: 'DELETE',
      body: JSON.stringify({ id: itemId }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(items => {
      this.setState({ items })
    })
  }

  subscribe() {
    const urlB64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
    
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    const key = "BEafwb8MmlVVMIlNGDIc7a70QqkEAsOIDeMfot4Evgp2siGR3hyDfOhly-u5dP_CrxQLNqihSgm0ScTXdgkeuOo"
  
    global.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(key)
      }).then(sub => {
        console.log("Subscribed!")
      }).catch(err => {
        console.log("Did not subscribe.")
      })
    }

    testPushMessage = () => {
      global.registration.showNotification('Test Message', {
        body: 'Success!'
      })
    }
    
  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">
            <img src={logo} className="App-logo" alt="logo" />
            Todo List
          </span>
        </nav>

        <div className="px-3 py-2">
        <button onClick={this.subscribe}>Subscribe for Notifications</button>
        <button onClick={this.testPushMessage}>Test Push Message</button>


          <form className="form-inline my-3" onSubmit={this.addItem}>
            <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
              <input
                className="form-control col-12"
                placeholder="What do you need to do?"
                value={this.state.todoItem}
                onChange={e => this.setState({
                  todoItem: e.target.value
                })}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mb-2 col-4 col-sm-2">
              Add
            </button>
          </form>

          { this.state.loading && <p>Loading...</p> }

          {
            !this.state.loading && this.state.items.length === 0 &&
            <div className="alert alert-secondary">
              No items - all done!
            </div>
          }

          {
            !this.state.loading && this.state.items &&
            <table className="table table-striped">
              <tbody>
                {
                  this.state.items.map((item, i) => {
                    return (
                      <tr key={item.id} className="row">
                        <td className="col-1">{i+1}</td>
                        <td className="col-10">{item.item}</td>
                        <td className="col-1">
                          <button
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={() => this.deleteItem(item.id)}
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          }

        </div>

      </div>
    );
  }
}

export default App
