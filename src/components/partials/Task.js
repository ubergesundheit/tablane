import {Component} from 'react'
import './assets/Task.css'
import {Popover} from "@material-ui/core";
import axios from "axios";
import {connect} from "react-redux";

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchor: null,
            options: ['error'],
            currentOption: null,
        }
    }

    handleClose = () => {
        this.setState({anchor: null})
    }

    render() {
        return (
            <div className="Task">
                <p>{this.props.task.name}</p>
                <div>
                    {Object.entries(this.props.task.options).map(([key, val]) => {
                        return <div
                            key={key}
                            onClick={e => {
                                this.setState({
                                    anchor: e.currentTarget,
                                    options: this.props.attributes[key],
                                    currentOption: key
                                })
                            }}>{this.props.attributes[key][val]}</div>
                    })}
                    <Popover
                        open={Boolean(this.state.anchor)}
                        anchorEl={this.state.anchor}
                        onClose={this.handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <div className="task-popover">
                            <div className="options">
                                {this.state.options.map(x => {
                                    return <div
                                        key={x}
                                        onClick={e => {
                                            let data = {
                                                property: this.state.currentOption,
                                                value: this.state.options.indexOf(e.currentTarget.textContent)
                                            }
                                            axios({
                                                method: 'PATCH',
                                                data,
                                                withCredentials: true,
                                                url: `http://localhost:3001/api/task/${this.props.board._id}/${this.props.taskGroupId}/${this.props.task._id}`
                                            }).then(res => {
                                                this.props.getData()
                                            })
                                            this.handleClose()
                                        }}>{x}</div>
                                })}
                            </div>
                            <div className="edit">
                                <i className="fas fa-pen"> </i>
                                <p>Edit Labels</p>
                            </div>
                        </div>
                    </Popover>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

export default connect(mapStateToProps)(Task)