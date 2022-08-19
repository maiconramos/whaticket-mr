import React, { useEffect, useState, useContext } from "react";
import openSocket from "socket.io-client";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import api from "../../services/api";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";
import Connections from "../Connections/";
import toastError from "../../errors/toastError";
import TextField from '@mui/material/TextField';
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import http from 'http';
import { FormControl, Select, MenuItem } from "@mui/material";
//const http = require('http');

const init = { 
  host: process.env.REACT_APP_BACKEND_URL.split("//")[1],
  //host: 'http://localhost',
  path: '/Disparador',
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset=utf-8'
  }
};
console.log(init);
 
const callback = function(response) {
  let result = Buffer.alloc(0);
  response.on('data', function(chunk) {
    result = Buffer.concat([result, chunk]);
  });
  
  response.on('end', function() {
    console.log(result.toString());
  });
};

async function ZDGSender(number, message, iD, token) {
	const req = http.request(init, callback);
	const body = '{"number":"'+ number + '@c.us","message":"' + message.replace(/\n/g, "\\n") + '","token":"' + token + '","ticketwhatsappId":' + iD + '}';
	console.log(body);
	await req.write(body);
	req.end();
}

const init2 = {
	host: process.env.REACT_APP_BACKEND_URL.split("//")[1],
	path: '/whatsappzdg'
  };
  
async function GETSender() {
	http.get(init2, function(res) {
		res.on("data", function(wppID) {
		  alert("ID instância ativa: " + wppID) ;
		});
	  }).on('error', function(e) {
		alert("Erro: " + e.message);
	  });
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

	const [whatsappId, setWhatsappId] = React.useState('');

	const handleChangeSelect = (event: SelectChangeEvent) => {
		setWhatsappId(event.target.value);
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
			const rndInt = randomIntFromInterval(inputs.min, inputs.max)
			const numberDDI = user.substring(0, 2);
			const numberDDD = user.substring(2, 4);
			await timer(rndInt * 1000)
			if (numberDDI !== "55") {
				ZDGSender(user, inputs.message, inputs.id, token);
				await timer(rndInt * 1000)
				alert('Mensagem enviada para o número DDI: ' + user);
			}
			else if (numberDDI === "55" && parseInt(numberDDD) <= 30) {
				const numberUser = user.substr(-8,8);
				await timer(rndInt * 1000)
				ZDGSender(numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString(), inputs.message, inputs.id, token);
				alert('Mensagem enviada para o número: ' + numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString());
			}
			else if (numberDDI === "55" && parseInt(numberDDD) > 30) {
				const numberUser = user.substr(-8,8);
				await timer(rndInt * 1000)
				ZDGSender(numberDDI.toString() + numberDDD.toString() + numberUser.toString(), inputs.message, inputs.id, token);
				alert('Mensagem enviada para o número: ' + numberDDI.toString() + numberDDD.toString() + numberUser.toString());
			}
			// ZDGSender(user, inputs.message, inputs.id, token);
			// alert(rndInt + ' Mensagem enviada para o número DDI: ' + user);
		}

		// usersTextArea.forEach(async (user) => {
		// 	const numberDDI = user.substring(0, 2);
		// 	const numberDDD = user.substring(2, 4);
		// 	const rndInt = randomIntFromInterval(1, 6)
		// 	console.log(rndInt)		
			
		// 	setTimeout(function() {
		// 		if (numberDDI !== "55") {
		// 		setTimeout(function() {
		// 		ZDGSender(user, inputs.message, inputs.id, token);
		// 		await timer(rndInt * 1000)
		// 		alert(rndInt + 'Mensagem enviada para o número DDI: ' + user);
		// 		},5000 + Math.floor(Math.random() * 3000))
		// 		}
		// 		else if (numberDDI === "55" && parseInt(numberDDD) <= 30) {
		// 		setTimeout(function() {
		// 		const numberUser = user.substr(-8,8);
		// 		await timer(rndInt * 1000)
		// 		ZDGSender(numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString(), inputs.message, inputs.id, token);
		// 		alert(rndInt + 'Mensagem enviada para o número com 9: ' + numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString());
		// 		},5000 + Math.floor(Math.random() * 3000))  
		// 		}
		// 		else if (numberDDI === "55" && parseInt(numberDDD) > 30) {
		// 		setTimeout(function() {
		// 		const numberUser = user.substr(-8,8);
		// 		await timer(rndInt * 1000)
		// 		ZDGSender(numberDDI.toString() + numberDDD.toString() + numberUser.toString(), inputs.message, inputs.id, token);
		// 		alert(rndInt + 'Mensagem enviada para o número sem 9: ' + numberDDI.toString() + numberDDD.toString() + numberUser.toString());
		// 		},5000 + Math.floor(Math.random() * 3000)) 
		// 		}
		// 	},5000 + Math.floor(Math.random() * 10000))            
		// });
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
				<TextField 
					id="outlined-basic" 
					label="ID de Disparo" 
					variant="outlined" 
					name="id" 
					value={inputs.id || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
				/>
				</Paper>
				<FormControl fullWidth>
					{/* 
					<InputLabel id="demo-simple-select-label">Qual a conexão? {Connections}</InputLabel>*/}
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={whatsappId}
						label="Conexão"
						onChange={handleChangeSelect}
					>

						 {loading ? (
							<MenuItem  key={whatsApps.id}  value="">"Carregando"</MenuItem> 
						) : ( whatsApps?.length > 0 && whatsApps.map(whatsApp => (
							<MenuItem key={whatsApp.id} value={whatsApp.id}>{whatsApp.id} - {whatsApp.name}</MenuItem>
						)))} 
					</Select>
					</FormControl>
				<Paper className={classes.paper}>
				<TextField style={{marginRight: 5}}
					id="outlined-basic" 
					label="Intervalo minímo (Segundos)" 
					variant="outlined" 
					name="min" 
					value={inputs.min || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
				/>
				<TextField style={{marginLeft: 5}}
					id="outlined-basic" 
					label="Intervalo máximo (Segundos)" 
					variant="outlined" 
					name="max" 
					value={inputs.max || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
				/>
				</Paper>
				<Button variant="contained" color="primary" className={classes.button} onClick={GETSender}>
				Mostrar ID de Disparo
				</Button>
				<Button variant="contained" color="secondary" className={classes.button} type="submit">
				DISPARAR
				</Button>
			</form>
			</Container>
		</div>
	);
};

export default Disparador;