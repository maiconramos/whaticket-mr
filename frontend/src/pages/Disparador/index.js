import React, { useEffect, useState, useContext } from "react";
import openSocket from "socket.io-client";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import api from "../../services/api";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";
import toastError from "../../errors/toastError";
import TextField from '@mui/material/TextField';
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import axios from 'axios';
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import Slider from '@mui/material/Slider';

const init = { 
  host: process.env.REACT_APP_BACKEND_URL+"/Disparador",
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset=utf-8'
  }
};

async function SendMessageText(number, message, iD, token) {
	const url = init.host;
	const headers = init.headers;
	const body = '{"number":"'+ number + '@c.us","message":"' + message.replace(/\n/g, "\\n") + '","token":"' + token + '","ticketwhatsappId":' + iD + '}';
	await axios.post(url, body, {
			headers: headers
		}
	  ).then((response) => {
		console.log(response)
	  })
}

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(8, 8, 3),
		backgroundColor: theme.palette.background.default
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		verticalAlign: "middle",
		marginBottom: 12,
	},

	slider: {
		marginTop: 12,
	},

	button: {
		padding: theme.spacing(2),
		display: "inline-flex",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		verticalAlign: "middle",
		marginBottom: 12,
		marginRight: 12,
	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},
}));

const Disparador = () => {
	const classes = useStyles();
	const [inputs, setInputs] = useState({});
	const [settings, setSettings] = useState([]);
	const { whatsApps, loading } = useContext(WhatsAppsContext);
	const [whatsappId, setWhatsappId] = React.useState('');
	const [valueSlider, setValueSlider] = React.useState([5, 120]);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await api.get("/settings");
				setSettings(data);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
	}, []);

	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	  }

	const handleChangeSelect = (event) => {
		setWhatsappId(event.target.value);
	};

	
	function valuetextSlider(value) {
		return `${valueSlider} segundos`;
	  }
	  

  const handleChangeSlider = (event, newValueSlider) => {
    setValueSlider(newValueSlider);
  };
	
	const handleSubmit = async (event) => {
		event.preventDefault();
		alert('As mensagens estão sendo carregadas! Esta página deve ficar aberta enquanto os disparos são realizados. Aguarde...');
		const usersTextArea = inputs.user.split('\n');
		const token = settings && settings.length > 0 && getSettingValue("userApiToken");
		const timer = ms => new Promise(res => setTimeout(res, ms))
		function randomIntFromInterval(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}
		for (const user of usersTextArea){
			const rndInt = randomIntFromInterval(valueSlider[0], valueSlider[1])
			console.log(valueSlider[0], valueSlider[1]);
			const numberDDI = user.substring(0, 2);
			const numberDDD = user.substring(2, 4);
			await timer(rndInt * 1000)
			if (numberDDI !== "55") {
				SendMessageText(user, inputs.message, whatsappId, token);
				await timer(rndInt * 1000)
				alert('Mensagem enviada para o número DDI: ' + user);
			}
			else if (numberDDI === "55" && parseInt(numberDDD) <= 30) {
				const numberUser = user.substr(-8,8);
				await timer(rndInt * 1000)
				SendMessageText(numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString(), inputs.message, whatsappId, token);
				alert('Mensagem enviada para o número: ' + numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString());
			}
			else if (numberDDI === "55" && parseInt(numberDDD) > 30) {
				const numberUser = user.substr(-8,8);
				await timer(rndInt * 1000)
				SendMessageText(numberDDI.toString() + numberDDD.toString() + numberUser.toString(), inputs.message, whatsappId, token);
				alert('Mensagem enviada para o número: ' + numberDDI.toString() + numberDDD.toString() + numberUser.toString());
			}
		}
	}
	
	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className={classes.root}>  
			<Container className={classes.container} maxWidth="sm">
			<Paper className={classes.paper}>
			<h1> Disparo automático de mensagens</h1>
			</Paper>
			<Paper className={classes.paper}>
			<h3><span role="img" aria-label="warning">⚠️</span> Por segurança envie suas mensagens em blocos de 30 contatos.</h3>
			</Paper>

			<form onSubmit={handleSubmit}>
				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="Números" 
					variant="outlined" 
					name="user" 
					value={inputs.user || ""} 
					onChange={handleChange}
					required
					fullWidth
					multiline
					margin="dense"
					placeholder="553588754197&#13;&#10;553588754197&#13;&#10;553588754197&#13;&#10;553588754197"
				/>
				</Paper>
				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="Mensagem" 
					variant="outlined" 
					name="message" 
					value={inputs.message || ""} 
					onChange={handleChange}
					required
					fullWidth
					multiline
					margin="dense"
					placeholder="Olá, tudo bem?&#13;&#10;Como posso te ajudar?&#13;&#10;Abraços, a gente se vê!"
				/>
				</Paper>
				<Paper className={classes.paper}>

				<FormControl fullWidth>
					<InputLabel id="whatsappId">Qual a conexão?</InputLabel>
					<Select
						labelId="whatsappId"
						id="whatsappId"
						name="whatsappId"
						value={whatsappId || ""}
						label="Qual a conexão?"
						onChange={handleChangeSelect}
					>
						 {loading ? (
							<MenuItem  key={whatsApps.id}  value="">"Carregando"</MenuItem> 
						) : ( whatsApps?.length > 0 && whatsApps.map(whatsApp => (
							<MenuItem key={whatsApp.id} value={whatsApp.id}>{whatsApp.id} - {whatsApp.name}</MenuItem>
						)))} 
					</Select>
					</FormControl>
				</Paper>
				<Paper className={classes.paper} sx={{ flexWrap: 'wrap' }}>
				<InputLabel id="input-slider">Intervalo de mínimo e máximo de segundos</InputLabel>
				<Slider
					getAriaLabel={() => 'Intervalo de tempo mínimo e máximo'}
					value={valueSlider}
					id="input-slider"
					onChange={handleChangeSlider}
					valueLabelDisplay="auto"
					aria-labelledby="input-slider"
					getAriaValueText={valuetextSlider}
					valueLabelDisplay="on"
					size="100%"
				/>
				</Paper>
				<Button variant="contained" color="primary" className={classes.button} type="submit">
				DISPARAR
				</Button>
			</form>
			</Container>
		</div>
	);
};

export default Disparador;