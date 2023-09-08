import { useState, useEffect } from 'react';

import PasswordCardDisplay from './components/PasswordCardDisplay';
import PasswordCardForm from './components/PasswordCardForm';
import { PasswordCardContent } from './model';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const App: React.FC = () => {
    // Home page general state
    const [cards, displayCards] = useState<PasswordCardContent[]>([])
    const [loadState, setLoadState] = useState<string>('Loading password cards...')

    // Card create/edit form state
    const emptyForm:PasswordCardContent = {uuid: "",url: "",name: "",userName:"",password:""}
    const [formIsOpen, setFormIsOpen] = useState<boolean>(false)
    const [formSubmitFunction, setFormSubmitFunction] = useState<() => (content:PasswordCardContent) => void>(() => (c:PasswordCardContent) => {})
    const [formContent, setFormContentState] = useState<PasswordCardContent>(emptyForm)

    // Search bar state
    const [searchPattern, setSearchPattern] = useState<string>("")

    // Load initial page state
    useEffect(() => {
        const loadCards = async () => {
            const cards = await fetchCards()
            displayCards(cards)
        }

        loadCards()
    }, [])

    // initial cards fetch from server
    const fetchCards = () => {
        const cards = fetch("http://localhost:8080/password-cards", {
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).then((response) => {
            setLoadState("No password cards to show.")
            return response.json()
        }).catch((err) => {
            setLoadState("Error fetching cards. Please, check your connection and reload the page...")
            // return empty list in case of error
            return {}
        })
        return cards
    }

    // open up card create form
    const openCreateForm = (content:PasswordCardContent) => {
        setFormContentState(content)
        setFormSubmitFunction(() => createCard)
        setFormIsOpen(true)
    }

    // Create a new password card
    const createCard = (cardContent:PasswordCardContent) => {
        return fetch("http://localhost:8080/password-cards", {
            method: 'POST',
            body: JSON.stringify(cardContent),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).then((response) => {
            if (response.ok) {
                return response.json()
            } else {throw new Error("error creating card")}
        }).then((json_data) =>{
            console.log(json_data.uuid)
            cardContent.uuid = json_data.uuid
            displayCards([...cards, cardContent])
            closeForm()
        }).catch((err) => {
            console.log(err)
        })
    }

    // open up card editing form
    const openEditForm = (content:PasswordCardContent) => {
        setFormContentState(content)
        setFormSubmitFunction(() => editCard)
        setFormIsOpen(true)
    }

    // Apply changes to edited card
    const editCard = (cardContent:PasswordCardContent) => {
        const updateURL = "http://localhost:8080/password-cards/" + cardContent.uuid
        return fetch(updateURL, {
            method: 'PUT',
            body: JSON.stringify(cardContent),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).then((response) => {
            console.log(response)
            if (response.ok) {
                console.log(cardContent)
                displayCards(
                    cards.map((card) =>
                        card.uuid === cardContent.uuid ?
                        {
                            uuid: cardContent.uuid,
                            name: cardContent.name,
                            url: cardContent.url,
                            userName: cardContent.userName,
                            password: cardContent.password,
                        } : card ))
                closeForm()
            } else {throw new Error("error updating card")}

        }).catch((err) => {
            console.log(err)
        })
    }

    // close card create/edit form/dialog
    const closeForm = () => {
        setFormContentState(emptyForm)
        setFormIsOpen(false)
    }

    // Delete card
    const deleteCard = async (uuid:string) => {
        const deleteURL = "http://localhost:8080/password-cards/" + uuid
        await fetch(deleteURL, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),

        }).then((response) => {
            if (response.ok) {
                displayCards(
                    cards.filter((card) =>
                        card.uuid !== uuid ))
            } else {throw new Error("error deleting card")}
        }).catch((err) => {
            console.log(err)
        })
    }


    return (
        <Container maxWidth="xl">
            <div className="App" style={{"marginTop":"60px"}}>

                <AppBar sx={{"minHeight":"50px"}}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            VelozientPass
                        </Typography>
                        <TextField
                            margin="dense"
                            placeholder="Search…"
                            variant="outlined"
                            size="small"
                            sx={{marginRight: 2, input: { color: 'grey', background: "white" } }}
                            onChange={(e) => setSearchPattern(e.target.value)}
                        />
                        <Button variant="contained"
                                color="secondary"
                                size="medium"
                                startIcon={<AddCircleIcon/>}
                                onClick={() => openCreateForm(emptyForm)}>
                            Create Card
                        </Button>
                    </Toolbar>
                </AppBar>

                <PasswordCardForm
                    formIsOpen={formIsOpen}
                    closeForm={closeForm}
                    saveChanges={formSubmitFunction}
                    content={formContent} />

                <Grid container direction="row" justifyContent="space-evenly" p={2} rowGap={2}>
                    {cards.length > 0 ? (
                        cards.filter(
                            (card) => card.name.toLowerCase()
                                          .includes(searchPattern.toLowerCase())
                        ).map((card) => (
                            <Card key={card.uuid}
                                  sx={{"minWidth":"400px"}} raised>
                                <Grid item>
                                    <PasswordCardDisplay
                                        onEdit={openEditForm}
                                        onDelete={deleteCard}
                                        content={card}/>
                                </Grid>
                            </Card>))) : ( <h1>{loadState}</h1>)
                    }
                </Grid>

            </div>
        </Container>
    );
}

export default App;
