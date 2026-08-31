import { Outlet } from "react-router-dom";
import DrawerAppBar from "../Components/NavBar";
import { RegionProvider } from "../Components/common/RegionContext";

const LayOut = () => {
  return (
    <RegionProvider>
      <DrawerAppBar>
        <Outlet />
      </DrawerAppBar>
    </RegionProvider>
  );
};

export default LayOut;
