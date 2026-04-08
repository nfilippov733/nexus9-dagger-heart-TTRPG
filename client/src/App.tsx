import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CharacterBuilder from "./pages/CharacterBuilder";
import EncounterBuilder from "./pages/EncounterBuilder";

function Router() {
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
