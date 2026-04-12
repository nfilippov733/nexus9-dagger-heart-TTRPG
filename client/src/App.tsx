import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CharacterBuilder from "./pages/CharacterBuilder";
import EncounterBuilder from "./pages/EncounterBuilder";

// Detect base path from Vite's import.meta.env.BASE_URL (set during build)
const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function Routes() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/character-builder" component={CharacterBuilder} />
      <Route path="/encounter-builder" component={EncounterBuilder} />
      <Route path="/book/:bookId" component={Home} />
      <Route path="/book/:bookId/:chapterId" component={Home} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <WouterRouter base={base}>
            <Routes />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
