import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../../util/api";
import openSocket from "socket.io-client";

import profileDefaultPic from "../../../../Images/profile_default.png";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},

	badgeStyle: {
		color: "white",
		backgroundColor: green[500],
	},

	contactsList: {
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
		height: 500,
		overflowY: "scroll",
		"&::-webkit-scrollbar": {
			width: "8px",
		},
		"&::-webkit-scrollbar-thumb": {
			// borderRadius: "2px",
			boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
			backgroundColor: "#e8e8e8",
		},
	},
	contactsSearchBox: {
		background: "#fafafa",
		position: "relative",
		padding: "10px 13px",
	},

	serachInputWrapper: {
		background: "#fff",
		borderRadius: 40,
	},

	searchIcon: {
		color: "grey",
		marginLeft: 7,
		marginRight: 7,
		verticalAlign: "middle",
	},

	contactsSearchInput: {
		border: "none",
		borderRadius: 30,
		width: "80%",
	},
}));

const ContactsList = ({ selectedContact, setSelectedContact }) => {
	const classes = useStyles();
	const token = localStorage.getItem("token");

	const [contacts, setContacts] = useState([]);
	const [displayedContacts, setDisplayedContacts] = useState([]);
	const [notification, setNotification] = useState(true);

	const history = useHistory();

	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const res = await api.get("/contacts", {
					headers: { Authorization: "Bearer " + token },
				});
				setContacts(res.data);
				setDisplayedContacts(res.data);
			} catch (err) {
				if (err.response.data.message === "invalidToken") {
					localStorage.removeItem("token");
					localStorage.removeItem("username");
					localStorage.removeItem("userId");
					history.push("/login");
					alert("Sessão expirada, por favor, faça login novamente.");
				}
				console.log(err);
			}
		};
		fetchContacts();
	}, [selectedContact, token, notification, history]);

	useEffect(() => {
		const socket = openSocket("http://localhost:8080");

		socket.emit("joinNotification");

		socket.on("contact", data => {
			if (data.action === "create") {
				addContact(data.contact);
			}
			if (data.action === "updateUnread") {
				resetUnreadMessages(data.contactId);
			}
		});

		socket.on("appMessage", data => {
			setNotification(prevState => !prevState);
			// handleUnreadMessages(data.message.contactId);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const resetUnreadMessages = contactId => {
		setDisplayedContacts(prevState => {
			let aux = [...prevState];
			let contactIndex = aux.findIndex(contact => contact.id === +contactId);
			aux[contactIndex].unreadMessages = 0;

			return aux;
		});
	};

	const addContact = contact => {
		setContacts(prevState => [contact, ...prevState]);
		setDisplayedContacts(prevState => [contact, ...prevState]);
	};

	const handleSelectContact = (e, contact) => {
		setSelectedContact(contact);
		setNotification(prevState => !prevState);
	};

	const handleSearchContact = e => {
		let searchTerm = e.target.value.toLowerCase();

		setDisplayedContacts(
			contacts.filter(contact =>
				contact.name.toLowerCase().includes(searchTerm)
			)
		);
	};

	return (
		<>
			<Paper variant="outlined" square className={classes.contactsSearchBox}>
				<div className={classes.serachInputWrapper}>
					<SearchIcon className={classes.searchIcon} />
					<InputBase
						className={classes.contactsSearchInput}
						placeholder="Buscar contatos"
						type="serach"
						onChange={handleSearchContact}
					/>
				</div>
			</Paper>
			<Paper variant="outlined" className={classes.contactsList}>
				<List>
					{displayedContacts.map((contact, index) => (
						<React.Fragment key={contact.id}>
							<ListItem button onClick={e => handleSelectContact(e, contact)}>
								<ListItemAvatar>
									<Avatar
										src={
											contact.imageURL ? contact.imageURL : profileDefaultPic
										}
									>
										>
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={contact.name}
									secondary="last contact message..."
								/>
								<ListItemSecondaryAction>
									{contact.unreadMessages > 0 && (
										<Badge
											badgeContent={contact.unreadMessages}
											classes={{
												badge: classes.badgeStyle,
											}}
										/>
									)}
								</ListItemSecondaryAction>
							</ListItem>
							<Divider variant="inset" component="li" />
						</React.Fragment>
					))}
				</List>
			</Paper>
		</>
	);
};

export default ContactsList;
