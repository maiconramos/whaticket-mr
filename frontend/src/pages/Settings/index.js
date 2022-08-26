import React, { useState, useEffect } from "react";
import openSocket from "../../services/socket-io";

import makeStyles from '@mui/styles/makeStyles';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";

import Tooltip from "@mui/material/Tooltip";

import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(8, 8, 3),
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
		marginBottom: 12,

	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},

}));

const Settings = () => {
	const classes = useStyles();

	const [settings, setSettings] = useState([]);

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

	useEffect(() => {
		const socket = openSocket();

		socket.on("settings", data => {
			if (data.action === "update") {
				setSettings(prevState => {
					const aux = [...prevState];
					const settingIndex = aux.findIndex(s => s.key === data.setting.key);
					aux[settingIndex].value = data.setting.value;
					return aux;
				});
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleChangeSetting = async e => {
		const selectedValue = e.target.value;
		const settingKey = e.target.name;

		try {
			await api.put(`/settings/${settingKey}`, {
				value: selectedValue,
			});
			toast.success(i18n.t("settings.success"));
		} catch (err) {
			toastError(err);
		}
	};

	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	return (
		<div className={classes.root}>
			<Container className={classes.container} maxWidth="sm">
				<Typography variant="body2" gutterBottom>
					{i18n.t("settings.title")}
				</Typography>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.userCreation.name")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="userCreation-setting"
						name="userCreation"
						value={
							settings && settings.length > 0 && getSettingValue("userCreation")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.userCreation.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.userCreation.options.disabled")}
						</option>
					</Select>

				</Paper>
				<Typography variant="body2" gutterBottom></Typography>
				<Tooltip title={i18n.t("settings.settings.timeCreateNewTicket.note")}>
					<Paper className={classes.paper} elevation={3}>
						<Typography variant="body1">
							{i18n.t("settings.settings.timeCreateNewTicket.name")}
						</Typography>
						<Select
							margin="dense"
							variant="outlined"
							native
							id="timeCreateNewTicket-setting"
							name="timeCreateNewTicket"
							value={
								settings && settings.length > 0 && getSettingValue("timeCreateNewTicket")
							}
							className={classes.settingOption}
							onChange={handleChangeSetting}
						>
							<option value="10">
								{i18n.t("settings.settings.timeCreateNewTicket.options.10")}
							</option>
							<option value="30">
								{i18n.t("settings.settings.timeCreateNewTicket.options.30")}
							</option>
							<option value="60">
								{i18n.t("settings.settings.timeCreateNewTicket.options.60")}
							</option>
							<option value="300">
								{i18n.t("settings.settings.timeCreateNewTicket.options.300")}
							</option>
							<option value="1800">
								{i18n.t("settings.settings.timeCreateNewTicket.options.1800")}
							</option>
							<option value="3600">
								{i18n.t("settings.settings.timeCreateNewTicket.options.3600")}
							</option>
							<option value="7200">
								{i18n.t("settings.settings.timeCreateNewTicket.options.7200")}
							</option>
							<option value="21600">
								{i18n.t("settings.settings.timeCreateNewTicket.options.21600")}
							</option>
							<option value="43200">
								{i18n.t("settings.settings.timeCreateNewTicket.options.43200")}
							</option>
							<option value="86400">
								{i18n.t("settings.settings.timeCreateNewTicket.options.86400")}
							</option>
							<option value="172800">
								{i18n.t("settings.settings.timeCreateNewTicket.options.172800")}
							</option>
						</Select>
					</Paper>
				</Tooltip>

				<Paper className={classes.paper}>
					<TextField
						id="api-token-setting"
						InputProps={{readOnly: true,}}
						label="Token Api"
						margin="dense"
						variant="outlined"
						fullWidth
						value={settings && settings.length > 0 && getSettingValue("userApiToken")}
					/>
				</Paper>

			</Container>
		</div>
	);
};

export default Settings;
