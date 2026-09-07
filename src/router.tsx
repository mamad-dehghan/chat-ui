import { Route, Router, Switch } from "wouter";
// import { useWouter } from "kitty";
import { ChatPage } from "./pages/chat";
import { ContactsPage } from "./pages/contacts";
import { SelectGroupUserPage } from "./pages/group/create";
import { ListPage } from "./pages/list";
import { UserPage } from "./pages/user";
import { UserProvider } from "./providers/user";
import { useHistoryLockAbility } from "kitty";

export const AppRouter = () => {
  useHistoryLockAbility()

  return (
    <UserProvider>
      <Router>
        <Switch>
          <Route path="/" component={ListPage} />
          <Route path="/chat/:id" component={ChatPage} />
          <Route path="/user/:id" component={UserPage} />
          <Route path="/contacts" component={ContactsPage} />
          <Route path="/create-group" component={SelectGroupUserPage} />

          <Route>404: No such page!</Route>
        </Switch>
      </Router>
    </UserProvider>
  );
};
