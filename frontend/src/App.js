import { Box } from "@mui/material";
import { Route,Routes } from "react-router-dom";
import LogIn from "./Components/LogIn";
function App() {
 



  return (
    <Box>
      <Routes>
        <Route path="/" element={<LogIn/>}/>
      </Routes>

      
    </Box>
  );
}

export default App;
