import { PasswordCardContent } from '../model';

import Button from '@mui/material/Button';

interface Props {
    onEdit: (cardContent: PasswordCardContent) => void,
    onDelete: (uuid: string) => void,
    content: PasswordCardContent,
}

const PasswordCardDisplay: React.FC<Props> = ({onEdit, onDelete, content}) => {
    return(
        <div>
            <span>Name: {content.name}</span><br />
            <span>URL: {content.url}</span><br />
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onEdit(content)}
            >
                Edit
            </Button>
            <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => onDelete(content.uuid)}
            >
                Delete
            </Button>
            <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => {navigator.clipboard.writeText(content.password)}}
            >
                Copy Password
            </Button>
        </div>
    )
};

export default PasswordCardDisplay;
