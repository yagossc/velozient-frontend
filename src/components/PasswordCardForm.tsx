import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { PasswordCardContent } from '../model';

interface Props {
    content: PasswordCardContent,
    formIsOpen: boolean,
    saveChanges: (cardContent: PasswordCardContent) => void,
    closeForm: () => void,
}

const PasswordCardForm: React.FC<Props> = ({formIsOpen, closeForm, saveChanges, content}) => {
    const [formState, setForm] = useState<PasswordCardContent>(content)
    const [validationError, setValidationError] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        setForm(content)
        setShowPassword(false)
    }, [content])

    const handleChange = (name:string, value:string) => {
        setForm(prevState => ({...prevState, [name]:value}))
    }

    const submit = (cardContent: PasswordCardContent) => {
        var formError = false
        Object.entries(cardContent).forEach(([cardField, cardValue]) => {
            if (cardField !== "uuid") {
                if (cardValue === "") {
                    setValidationError(true)
                    formError = true
                }
            }

        })

        if (formError === false) {
            setValidationError(false)
            saveChanges(cardContent)
            /* clearState() */
        }
    }

    const close = () => {
        setValidationError(false)

        closeForm()
    }

    const handleShowPassword = () => setShowPassword((show) => !show);

    return (
        <div>
            <Dialog open={formIsOpen} onClose={closeForm}>
                <DialogContent>
                    <div>
                        <DialogContentText>
                            New Password Card
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            required
                            name="name"
                            defaultValue={content.name}
                            error={validationError}
                            label="Name"
                            onChange={(e) => handleChange(e.target.name,
                                                          e.target.value) }
                        />
                        <TextField
                            margin="dense"
                            required
                            name="url"
                            defaultValue={content.url}
                            error={validationError}
                            label="URL"
                            onChange={(e) => handleChange(e.target.name,
                                                          e.target.value) }
                        />
                        <TextField
                            margin="dense"
                            required
                            name="userName"
                            defaultValue={content.userName}
                            error={validationError}
                            label="User Name"
                            onChange={(e) => handleChange(e.target.name,
                                                          e.target.value) }
                        />
                        <TextField
                            margin="dense"
                            required
                            name="password"
                            defaultValue={content.password}
                            error={validationError}
                            label="Password"
                            onChange={(e) => handleChange(e.target.name,
                                                          e.target.value) }
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                                submit({
                                    uuid: content.uuid,
                                    name: formState.name,
                                    url: formState.url,
                                    userName: formState.userName,
                                    password: formState.password,
                                })
                            }}>
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => close() }>
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PasswordCardForm;
