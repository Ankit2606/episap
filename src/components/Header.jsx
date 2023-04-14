import React,{useState,useContext} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import { WebThreeContext } from "../utils/ContextContract.jsx";
import ronaldo from "../assets/images/ronaldo.jpg"
import { useAuth0 } from "@auth0/auth0-react";

const pages = [
  { Page: "LeafNFT", link: "/leafnft" },
  { Page: "MyCreatedLeaf", link: "/createleaf" },
  { Page: "MarketPlace", link: "/marketplace" },
  { Page: "ResaleNFT", link: "/resalenft" },
  { Page: "MYNFT", link: "/mynft" },
];
const settings = ["Profile", "Account", "Dashboard"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const {account,connectWallet} = useContext(WebThreeContext)

  const Address = account?`${account.slice(0, 6)}...${account.slice(-4)}`:null;

  const { loginWithRedirect,isAuthenticated,logout,user } = useAuth0();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            EPISAPIENT
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((p, i) => (
                <MenuItem key={i} onClick={handleCloseNavMenu}>
                  <Link to={p.link} className="Link">
                    <Typography textAlign="center" sx={{ color: "black" }}>
                      {p.Page}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
              {!account?<Button
              onClick={connectWallet}
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700 ,marginLeft:"10px"}}
            >
              Connect
            </Button>:<Button
              onClick={connectWallet}
              sx={{ my: 0, color: "orange", display: "block", fontWeight: 700 ,marginLeft:"10px"}}
            >
              {Address}
            </Button>}
            
            </Menu>
            
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            EPISAPIENT
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((p, i) => (
              <Link to={p.link} className="Link">
                <Button
                  key={i}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontWeight: 700,
                  }}
                >
                  {p.Page}
                </Button>
              </Link>
            ))}
            {!account?<Button
              onClick={connectWallet}
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700 }}
            >
              Connect
            </Button>:<Button
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700,cursor:"default"}}
            >
              {Address}
            </Button>}
            
          </Box>

          <Box sx={{ flexGrow: 0 ,display:"flex"}}>
            
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {!isAuthenticated?<Avatar alt="Remy Sharp" src={ronaldo}/>:<Avatar src={user.picture} alt={user.name}/>}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
              {!isAuthenticated?<Button
              onClick={() => loginWithRedirect()}
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700,marginLeft:"8px" }}
            >
              LogIn
            </Button>:<Button
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700,marginLeft:"8px"}}
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              LogOut
            </Button>}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
