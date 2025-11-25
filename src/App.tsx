import "./App.css";
import { Container, CssBaseline } from "@mui/material";
import { AppRouter } from "./routes/AppRouter.tsx";

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <AppRouter />
      </Container>
    </>
  );
}

export default App;
