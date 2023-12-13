import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./homepage.css";
import "../../shared/tabs/tabs.css";
import FiltersSidebar from "../../shared/filterssidebar/filterssidebar";
import { useContext, useEffect, useState } from "react";
import SideBarIcon from "./../../../../../../../public/images/sidebaricon.svg";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BasicTabs from "../../shared/tabs/tabs";
import { HomeContext } from "../../../../context/tabdataContext";
import { ApiContext } from "../../../ApiContext";
import AllotmentContext from "../allotment/context/allotmentContext";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1), // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
export default function     PersistentDrawerLeft() {
  const { assignBreadCrums,setAssignBreadCrums, crumbsState, setCrumbsState } =
    useContext(AllotmentContext);

  const { resetFilter, setEminentData } = useContext(ApiContext);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [filterString, setFilterString] = useState("");
  const [tabId, setTabId] = useState("home");
  const [movTabId, setMovTabId] = useState("ministry_wise");
  const [clearFilter, setClearFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    switchTabHandler(searchParams.get("basicTabId"));
    localStorage.setItem("eminent_number", "");
    localStorage.setItem("view_mode", "");
    setEminentData({});
  }, []);


  const handleDrawerOpen = () => {
    setOpen(true);
    let button = document.querySelector(".btn-absolute");
    button.classList.toggle('active')
  };

  const handleDrawerClose = () => {
    setOpen(false);
    let button = document.querySelector(".btn-absolute");
    button.classList.toggle('active')
  };

  const crumbsHandeler = () => {
    setCrumbsState(!crumbsState);
    setAssignBreadCrums(false);
  };

  useEffect(() => {
    console.log("crumbs in home page", crumbsState);
  }, [crumbsState]);


  const switchTabHandler = (id) => {
    setTabId(id);
  };
  const handleMovTabsFilter = (newValue) => {
    setMovTabId(newValue);
  };

  const filterClear = () => {
    setClearFilter(true);
    setTimeout(function () {
      setClearFilter(false);
    }, 200);
  };

  return (
    <>
      <HomeContext.Provider value={{ movTabId, handleMovTabsFilter }}>
        <Box sx={{ display: "flex" }} className="mt-5">
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
            className="filtersidebar"
          >
            <div>
              <DrawerHeader className="d-flex justify-content-between mt-1.7 ms-4 ps-0">
                <h2 className="filter">Filters</h2>
                <IconButton className="chevronicon" onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <FiltersSidebar
                setFilterString={setFilterString}
                tabId={tabId}
                filterClear={filterClear}
              />
            </div>
          </Drawer>
          <Main open={open} className="p-0 mt-5 main-content">
            <Typography className="ms-15-30">
              <div>
                <div className="d-flex justify-content-between sidebar-btn">
                  <p className="heading">
                    <span>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: "none" }) }}
                      >
                        <SideBarIcon />
                      </IconButton>
                    </span>
                    {assignBreadCrums ? (
                      <>
                        <Link
                          onClick={crumbsHandeler}
                          style={{ textDecoration: "underline", fontWeight:"300 !important" }}
                        >
                          Allotment
                        </Link>
                        <span style={{fontWeight:"500 !important"}}> / Assign position</span>
                      </>
                    ) : (
                      "Eminent Personalities"
                    )}
                  </p>
                </div>
              </div>

              <BasicTabs
                filterString={filterString}
                onSwitchTab={switchTabHandler}
                openFilter={open}
                filterClear={clearFilter}
              />
            </Typography>
          </Main>
        </Box>
      </HomeContext.Provider>
    </>
  );
}
