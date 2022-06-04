import {Fragment, useState} from 'react'
import '../../../../styles/Task.css'
import TaskColumnPopover from "./task/TaskColumnPopover";
import {Draggable} from "react-beautiful-dnd";
import TaskPopover from "./task/TaskPopover";
import useInputState from "../../../../modules/hooks/useInputState";
import {useDispatch, useSelector} from "react-redux";
import { editOptionsTask, editTaskField } from "../../../../modules/state/reducers/boardReducer";
import {useHistory, useParams} from "react-router-dom";
import TaskModal from "./TaskModal";

function Task(props) {
    const { board } = useSelector(state => state.board)
    const dispatch = useDispatch()
    const history = useHistory()
    const { taskId } = useParams()
    const [anchor, setAnchor] = useState(null)
    const [activeOption, setActiveOption] = useState('')
    const [columnDialogOpen, setColumnDialogOpen] = useState(false)
    const [moreDialogOpen, setMoreDialogOpen] = useState(false)

    const [taskEditing, setTaskEditing] = useState(false)
    const [taskName, changeTaskName] = useInputState(props.task.name)

    const openTaskModal = () => {
        if (taskEditing) return
        history.push(`${history.location.pathname}/${props.task._id}`)
    }

    const handleClose = () => {
        setAnchor(null)
        setMoreDialogOpen(false)
        setColumnDialogOpen(false)
    }

    const handleClick = (e, key) => {
        setAnchor(e.currentTarget)
        setActiveOption(key._id)
        setColumnDialogOpen(!columnDialogOpen)
    }

    const handleMoreClick = (e) => {
        setAnchor(e.currentTarget)
        setMoreDialogOpen(!moreDialogOpen)
    }

    const handleTextEdit = async (e) => {
        const {taskGroupId, task} = props
        if (task.options.find(option => option.column === e.target.name)?.value === e.target.value) return

        dispatch(editOptionsTask({
            column: e.target.name,
            value: e.target.value,
            type: 'text',
            boardId: board._id,
            taskGroupId: taskGroupId,
            taskId: task._id
        }))
    }

    const getStatusLabel = (attribute) => {
        let taskOption = props.task.options.find(x => x.column === attribute._id)
        let label

        if (taskOption) {
            label = attribute.labels.find(x => x._id === taskOption.value)
        } else label = {color: 'rgb(196,196,196)', name: ''}

        if (!label) label = {color: 'rgb(196,196,196)', name: ''}

        return (
            <Fragment key={attribute._id}>
                <div
                    onClick={(e) => handleClick(e, attribute)}
                    style={{backgroundColor: label.color}}>
                    {label.name}
                </div>
                {attribute._id.toString() === activeOption && (
                    <TaskColumnPopover
                        attribute={attribute}
                        anchor={anchor}
                        open={columnDialogOpen}
                        task={props.task}
                        taskGroupId={props.taskGroupId}
                        handleClose={handleClose}/>)}
            </Fragment>
        )
    }

    const getTextLabel = (attribute) => {
        let taskOption = props.task.options.find(x => x.column === attribute._id)
        if (!taskOption) taskOption = { value: '' }
        return (
            <div style={{backgroundColor: 'transparent'}} key={attribute._id}>
                <input type="text" name={attribute._id} onBlur={handleTextEdit} defaultValue={taskOption.value}/>
            </div>
        )
    }

    const toggleTaskEdit = () => {
        document.activeElement.blur()
        setTimeout(() => setTaskEditing(!taskEditing), 0)
    }

    const handleTaskEdit = (e) => {
        e.preventDefault()
        const {taskGroupId, task} = props
        toggleTaskEdit()
        dispatch(editTaskField({
            type: 'name',
            value: taskName,
            boardId: board._id,
            taskGroupId,
            taskId: task._id
        }))
    }

    return (
        <>
            <Draggable draggableId={props.task._id} index={props.index} type="task">
                {(provided) => (
                    <div
                        className={`Task ${taskEditing ? 'editing' : ''}`} {...provided.draggableProps}
                        onClick={openTaskModal}
                        ref={provided.innerRef} {...provided.dragHandleProps}>
                        {taskEditing
                            ? (
                                <form onSubmit={handleTaskEdit} onBlur={handleTaskEdit}>
                                    <input type={taskName}
                                           onKeyUp={e => {
                                               if (e.key === 'Escape') e.currentTarget.blur()
                                           }}
                                           value={taskName}
                                           onChange={changeTaskName}
                                           name="taskName" autoFocus/>
                                </form>
                            )
                            : <p>{props.task.name}</p>}
                        <div onClick={e => e.stopPropagation()}>
                            {board.attributes.map(attribute => {

                                if (attribute.type === "status") return getStatusLabel(attribute)
                                if (attribute.type === "text") return getTextLabel(attribute)

                                return (
                                    <div style={{backgroundColor: 'crimson'}} key={Math.random()}>
                                        ERROR
                                    </div>
                                )
                            })}

                            <div onClick={handleMoreClick}>
                                <i className="fas fa-ellipsis-h"> </i>
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>

            {!taskEditing && <TaskPopover
                toggleTaskEdit={toggleTaskEdit}
                open={moreDialogOpen}
                anchor={anchor}
                handleClose={handleClose}
                taskGroupId={props.taskGroupId}
                task={props.task}/>}

            {taskId === props.task._id && (
                <TaskModal boardId={board._id} taskGroupId={props.taskGroupId} task={props.task} />
            )}
        </>
    );
}

export default Task