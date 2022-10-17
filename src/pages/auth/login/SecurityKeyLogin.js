import { Button, Divider } from '@mantine/core'
import { startAuthentication } from '@simplewebauthn/browser'
import styles from '../../../styles/TotpCode.module.scss'
import { Link } from 'react-router-dom'
import { useLoginUserMutation } from '../../../modules/services/userSlice'
import { toast } from 'react-hot-toast'
import { CircularProgress } from '@mui/material'

function SecurityKeyLogin({ form }) {
    const [loginUser, { isLoading }] = useLoginUserMutation()

    const phoneIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-smartphone"
        >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
    )

    const handleSubmit = async e => {
        e.preventDefault()
        form.setFieldValue('request_security_key_challenge', true)
        const { options } = await loginUser({
            ...form.values,
            request_security_key_challenge: true
        }).unwrap()

        let authenticatorResponse
        try {
            authenticatorResponse = await startAuthentication(options)
        } catch (err) {
            console.log(err)
            toast('Authentication failed')
        }

        form.setFieldValue('authenticatorResponse', authenticatorResponse)
        loginUser({
            ...form.values,
            authenticatorResponse
        })
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <p className={styles.header}>
                    Multi-factor authentication (MFA) required
                </p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <span className={styles.label}>
                        Use Fingerprint or Face Recognition to Verify your
                        Identity
                    </span>
                    <div className={styles.totpInput}></div>
                    <div
                        style={{
                            position: 'relative'
                        }}
                    >
                        <Button
                            mt={20}
                            fullWidth
                            type="submit"
                            disabled={isLoading}
                        >
                            Verify
                        </Button>
                        {isLoading && (
                            <CircularProgress
                                size={24}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px'
                                }}
                            />
                        )}
                    </div>
                </form>
                <Divider my={20} label="OR" labelPosition="center" />
                <Button
                    leftIcon={phoneIcon}
                    variant="default"
                    color="gray"
                    mt={12}
                    fullWidth
                    onClick={() => form.setFieldValue('type', 'totp')}
                >
                    Verify with Authenticator App
                </Button>
                <div className={styles.text}>
                    <p style={{ marginBottom: '0' }}>
                        By signing in, you agree to our
                    </p>
                    <p style={{ marginTop: '5px', marginBottom: '0' }}>
                        <a className={styles.link} href="#">
                            Terms of Service
                        </a>
                        <span> and </span>
                        <a className={styles.link} href="#">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
            <div className={styles.registerText}>
                <span className={styles.text}>
                    <span>Don't have an account? </span>
                    <Link className={styles.link} to="/register">
                        Sign up
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default SecurityKeyLogin
