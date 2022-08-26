import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import { Badge } from "@mui/material";
import DesktopMacOutlinedIcon from '@mui/icons-material/DesktopMacOutlined';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import CodeIcon from '@mui/icons-material/Code';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can"; 

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) =>({
	icon: {
		color: process.env.REACT_APP_COLOR_ICON_SIDEBAR || theme.palette.primary.main
	},
  linkSidebar: {
    color: process.env.REACT_APP_COLOR_LINK_SIDEBAR || "rgba(0, 0, 0, 0.87)",
    '&:hover': {
      color: process.env.REACT_APP_COLOR_LINK_HOVER_SIDEBAR || "rgba(0, 0, 0, 0.87)",
   },
  },
  divisorSidebar: {
    borderColor: process.env.REACT_APP_BORDER_COLOR_DIVISOR_SIDEBAR || "rgba(0, 0, 0, 0.12)"
  },
  subHeaderSidebar: {
    backgroundColor: process.env.REACT_APP_BACKGROUND_SUBHEADER_SIDEBAR || "#ffffff",
    color: process.env.REACT_APP_COLOR_SUBHEADER_SIDEBAR || "rgba(0, 0, 0, 0.87)",
  }
}));

function ListItemLink(props) {
  const { icon, primary, to, className } = props;
  const classes = useStyles();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink} className={`${className} ${classes.linkSidebar}`}>
        {icon ? <ListItemIcon className={classes.icon}>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const MainListItems = (props) => {
  const { drawerClose } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  return (
    <div onClick={drawerClose}>
    <ListItemLink
        to="/tickets"
        primary={i18n.t("mainDrawer.listItems.tickets")}
        icon={<WhatsAppIcon />}
      />

      <ListItemLink
        to="/contacts"
        primary={i18n.t("mainDrawer.listItems.contacts")}
        icon={<ContactPhoneOutlinedIcon />}
      />
      
      
      <ListItemLink
        to="/quickAnswers"
        primary={i18n.t("mainDrawer.listItems.quickAnswers")}
        icon={<QuestionAnswerOutlinedIcon />}
      />
      
     
      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider className={classes.divisorSidebar} />
            <ListSubheader className={classes.subHeaderSidebar} inset>
              {i18n.t("mainDrawer.listItems.administration")}
            </ListSubheader>
            
            <ListItemLink
              to="/dashboard"
              primary="Dashboard"
              icon={<DesktopMacOutlinedIcon />}
            />
            <ListItemLink
                to="/connections"
                primary={i18n.t("mainDrawer.listItems.connections")}
                icon={
                  <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                    <QrCodeScannerIcon />
                  </Badge>
                }
              />
            <ListItemLink
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<PeopleAltOutlinedIcon />}
            />
            <ListItemLink
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<AccountTreeOutlinedIcon />}
            />
            <ListItemLink
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<SettingsOutlinedIcon />}
            />
            <Divider />
            <ListSubheader className={classes.subHeaderSidebar} inset>
              {i18n.t("mainDrawer.listItems.apititle")}
            </ListSubheader>
            <ListItemLink
              to="/api"
              primary={i18n.t("mainDrawer.listItems.api")}
              icon={
                <CodeIcon />
              }
            />
            <ListItemLink
              to="/apidocs"
              primary={i18n.t("mainDrawer.listItems.apidocs")}
              icon={
                <MenuBookIcon />
              }
            />
            <ListItemLink
              to="/apikey"
              primary={i18n.t("mainDrawer.listItems.apikey")}
              icon={
                <VpnKeyRoundedIcon />
              }
            />
          </>
        )}
      />
    </div>
  );
};

export default MainListItems;
