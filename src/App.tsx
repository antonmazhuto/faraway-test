import { Container, CssBaseline } from "@mui/material";
import { AppRouter } from "./routes/AppRouter.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

function App() {
  return (
    <ErrorBoundary>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ paddingBottom: 2 }}>
        <AppRouter />
      </Container>
    </ErrorBoundary>
  );
}

export default App;
