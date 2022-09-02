import React, { useEffect, useState, useContext } from "react";
import openSocket from "socket.io-client";
import { makeStyles } from "@mui/styles";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import api from "../../services/api";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";
import toastError from "../../errors/toastError";
import TextField from '@mui/material/TextField';
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import axios from 'axios';
import { Select, MenuItem, InputLabel } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Slider from '@mui/material/Slider';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Grid from "@mui/material/Grid";
import MainContainer from "../../components/MainContainer";
import SendIcon from '@mui/icons-material/Send';

const init = { 
  host: process.env.REACT_APP_BACKEND_URL,
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset=utf-8'
  }
};

async function SendMessageText(number, message, iD, token) {
	const headers = init.headers;
	const body = '{"number":"'+ number + '@c.us","message":"' + message.replace(/\n/g, "\\n") + '","token":"' + token + '","ticketwhatsappId":' + iD + '}';
	await axios.post(init.host+"/send-message", body, {
			headers: headers
		}
	  ).then((response) => {
		console.log(response)
	  })
}
async function sendMedia(number, url, title, iD, token) {
	const headers = init.headers;
	const body = '{"number":"'+ number + '@c.us","url":"' + url + '","title":"' + title + '","token":"' + token + '","ticketwhatsappId":' + iD + '}';
	await axios.post(init.host+"/send-media", body, {
			headers: headers
		}
	  ).then((response) => {
		console.log(response)
	  })
}
async function sendAudio(number, urlAudio, iD, token) {
	const headers = init.headers;
	const body = '{"number":"'+ number + '@c.us","url":"' + urlAudio + '","token":"' + token + '","ticketwhatsappId":' + iD + '}';
	await axios.post(init.host+"/send-audio", body, {
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

	alert: {
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
	const [whatsappId, setWhatsappId] = React.useState('');
	const [logMessageSent, setlogMessageSent] = React.useState([]);
	const [valueSlider, setValueSlider] = React.useState([5, 120]);
	const [valueRadio, setvalueRadio] = React.useState('texto');

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

	const handleChangeRadio = (event) => {
		setvalueRadio(event.target.value);
	};
	
	function valuetextSlider(value) {
		return `${valueSlider} segundos`;
	  }	  

	const handleChangeSlider = (event, newValueSlider) => {
		setValueSlider(newValueSlider);
	};
	
	const handleSubmit = async (event) => {
		event.preventDefault();
		const usersTextArea = inputs.user.split('\n');
		const token = settings && settings.length > 0 && getSettingValue("userApiToken");
		const timer = ms => new Promise(res => setTimeout(res, ms))
		function randomIntFromInterval(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}
		for (const user of usersTextArea){
			const rndInt = randomIntFromInterval(valueSlider[0], valueSlider[1])
			const numberDDI = user.substring(0, 2);
			const numberDDD = user.substring(2, 4);
			const log = [];
			await timer(rndInt * 1000);

			if (valueRadio === 'texto') {
				SendMessageText(user, inputs.message, whatsappId, token);
				await timer(rndInt * 1000);
				setlogMessageSent(log => [...log, `Mensagem enviada para o número: ${user}`]);
			} else if (valueRadio === 'midia') {
				sendMedia(user, inputs.url, inputs.title, whatsappId, token);
				await timer(rndInt * 1000);
				alert('Arquivo enviada para o número DDI: ' + user);
			} else if (valueRadio === 'audio') {
				sendAudio(user, inputs.urlAudio, whatsappId, token);
				await timer(rndInt * 1000);
				alert('Áudio enviado para o número DDI: ' + user);
			}
			
			/*
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
			}*/
		}
	}
	
	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<MainContainer className={classes.mainContainer}>
			<form onSubmit={handleSubmit}>
		<MainHeader>
       		 <Title>Disparo automático de mensagens</Title>
				<MainHeaderButtonsWrapper>
					<Button variant="contained" color="primary" className={classes.button} type="submit">
						DISPARAR <SendIcon sx={{ ml: 1 }}	 />
					</Button>
				</MainHeaderButtonsWrapper>
		</MainHeader>
			<Grid container spacing={2} sx={{ p: 2 }}>
			<Grid
				item
				xs={12}
				md={6}
			>					
					<Paper className={classes.paper} sx={{ flexWrap: 'wrap' }} >
					<FormControl>
					<RadioGroup
						row
						name="tipo"
						defaultValue="texto"
						sx={{ mb: 2 }}					
					>
					<FormControlLabel
					value="texto"
					control={<Radio />}
					label="Texto"
					onChange={handleChangeRadio}
					checked={valueRadio === "texto"}
					labelPlacement="bottom"
					/>
					<FormControlLabel
					value="midia"
					control={<Radio />}
					onChange={handleChangeRadio}
					checked={valueRadio === "midia"}
					label="Imagem ou vídeo"
					labelPlacement="bottom"
					/>
					<FormControlLabel
					value="audio"
					control={<Radio />}
					onChange={handleChangeRadio}
					checked={valueRadio === "audio"}
					label="Audio"
					labelPlacement="bottom"
					/>
					</RadioGroup>
					</FormControl>
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
							sx={{ mb: 2 }}	
						/>
						{valueRadio === "texto" ? (	
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
								sx={{ mb: 2 }}	
							/>
						) : false}
						{valueRadio === "midia" ? (	
							<>
							<TextField
								id="outlined-textarea"
								label="URL do arquivo" 
								variant="outlined" 
								name="url" 
								value={inputs.url || ""} 
								onChange={handleChange}
								required
								fullWidth
								multiline
								margin="dense"
								placeholder="Cole a URL da imagem, vídeo ou pdf"
								sx={{ mb: 2 }}	
							/>
							<TextField
								id="outlined-textarea"
								label="Qual a legenda do arquivo?" 
								variant="outlined"
								name="title"
								value={inputs.title || ""}
								onChange={handleChange}
								required
								fullWidth
								multiline
								margin="dense"
								placeholder="Qual a legenda do arquivo?"
								sx={{ mb: 2 }}	
							/>
							</>
						) : false}
						{valueRadio === "audio" ? (	
							<>
							<TextField
								id="url-audio"
								label="URL do arquivo" 
								variant="outlined" 
								name="urlAudio" 
								value={inputs.urlAudio || ""} 
								onChange={handleChange}
								required
								fullWidth
								multiline
								margin="dense"
								placeholder="Cole a URL do arquivo de audio, no formato .OGG"
								sx={{ mb: 2 }}	
							/>
							</>
						) : false}
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
						<InputLabel id="input-slider-label"  sx={{ m: 2 }}>Intervalo entre os disparos em segundos</InputLabel>
							<Slider
								getAriaLabel={() => 'Intervalo de tempo mínimo e máximo'}
								value={valueSlider}
								id="input-slider"
								onChange={handleChangeSlider}
								aria-labelledby="input-slider"
								getAriaValueText={valuetextSlider}
								valueLabelDisplay="on"
								size="100%"
								/>
						</Paper>
				</Grid>
				<Grid
				item
				xs={12}
				md={6}
			>
				<Alert severity="warning" className={classes.alert} >
					<AlertTitle>Muito Cuidado</AlertTitle>
					Por segurança envie suas mensagens em blocos de 30 contatos.<br />
					Esta página deve ficar aberta enquanto os disparos são realizados
					<strong>Nunca use o chip principal para fazer envio, use um descartável</strong>
				</Alert>
				<Alert severity="info">
					<AlertTitle>Log</AlertTitle>
					{logMessageSent.map((element, index) => {
						return (
						<p key={index}>
							{element}
						</p>
						);
					})}
					
				</Alert>
			</Grid>
			</Grid>
			</form>
		</MainContainer>
	);
};

export default Disparador;