import { Popover } from '@mui/material'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useContext } from 'react'
import WorkspaceContext from '../../../modules/context/WorkspaceContext'
import styles from '../../../styles/UserPopup.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro'

function UserPopup(props) {
    const { workspace, getData } = useContext(WorkspaceContext)

    const copyId = () => {
        navigator.clipboard.writeText(props.member.user._id)
        toast('Copied!')
        props.close()
    }

    const removeUser = () => {
        axios({
            method: 'DELETE',
            withCredentials: true,
            url: `${process.env.REACT_APP_BACKEND_HOST}/api/workspace/user/${workspace._id}/${props.member.user._id}`
        })
            .then(res => {
                toast('User removed')
                getData()
            })
            .catch(err => {
                if (err.response && err.response.data.error) {
                    toast(err.response.data.error)
                }
            })
        props.close()
    }

    return (
        <div>
            <Popover
                open={Boolean(props.anchor)}
                anchorEl={props.anchor}
                onClose={props.close}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <div className={styles.container}>
                    {!props.member.labels.includes('Pending') && (
                        <>
                            <div onClick={copyId}>
                                <div>
                                    <FontAwesomeIcon icon={regular('clone')} />
                                </div>
                                <p>Copy Member ID</p>
                            </div>
                            {props.member.role !== 'owner' && (
                                <div onClick={removeUser}>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={solid('times')}
                                        />
                                    </div>
                                    <p>Remove</p>
                                </div>
                            )}
                        </>
                    )}
                    {props.member.labels.includes('Pending') && (
                        <>
                            <div>
                                <div>
                                    <FontAwesomeIcon icon={solid('share')} />
                                </div>
                                <p>Resend Invitation</p>
                            </div>
                            <div>
                                <div>
                                    <FontAwesomeIcon icon={solid('times')} />
                                </div>
                                <p>Cancel invite</p>
                            </div>
                        </>
                    )}
                </div>
            </Popover>
        </div>
    )
}

export default UserPopup
