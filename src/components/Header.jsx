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

const fontfamily= "'DynaPuff', cursive";

const pages = [
  { Page: "CreateIdea", link: "/createidea" },
  { Page: "LeafNFT", link: "/leafnft" },
  { Page: "MarketPlace", link: "/marketplace" },
];
const settings = [{ Page: "MyCreatedLeaf", link: "/createleaf" },{ Page: "MYNFT", link: "/mynft" },];

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
          {/* <img style={{ display: { xs: "none", md: "flex" }, mr: 1 }} src={panda} alt="panda" /> */}

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              fontFamily:fontfamily
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
                    <Typography textAlign="center" sx={{ color: "black",fontFamily:fontfamily }}>
                      {p.Page}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
              {!account?<Button
              onClick={connectWallet}
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700 ,marginLeft:"10px",fontFamily:fontfamily}}
            >
              Connect
            </Button>:<Button
              onClick={connectWallet}
              sx={{ my: 0, color: "orange", display: "block", fontWeight: 700 ,marginLeft:"10px",fontFamily:fontfamily}}
            >
              {Address}
            </Button>}
            
            </Menu>
            
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          {/* <img style={{ display: { xs: "flex", md: "none" }, mr: 1 }} src={panda} alt="panda" /> */}

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily:fontfamily,
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
                    fontFamily:fontfamily
                    ,fontSize:"17px",
                    letterSpacing:'1px'

                  }}
                >
                  {p.Page}
                </Button>
              </Link>
            ))}
            {!account?<Button
              onClick={connectWallet}
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700,fontFamily:fontfamily }}
            >
              Connect
            </Button>:<Button
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700,cursor:"default",fontFamily:fontfamily}}
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
                  <Link to={setting.link} className="Link"><Typography textAlign="center" sx={{color: "black",fontFamily:fontfamily}}>{setting.Page}</Typography></Link>
                </MenuItem>
              ))}
              {!isAuthenticated?<Button
              onClick={() => loginWithRedirect()}
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700,marginLeft:"8px",fontFamily:fontfamily }}
            >
              LogIn
            </Button>:<Button
              sx={{ my: 2, color: "orange", display: "block", fontWeight: 700,marginLeft:"8px",fontFamily:fontfamily}}
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
