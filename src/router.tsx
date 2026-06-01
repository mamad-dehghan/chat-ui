import { Route, Router, Switch } from "wouter";
import { useWouter } from "./lib/kitty/hooks/useWouter";
import { ChatPage } from "./pages/chat";
import { ContactsPage } from "./pages/contacts";
import { SelectGroupUserPage } from "./pages/group/create";
import { ListPage } from "./pages/list";
import { UserPage } from "./pages/user";
import { ChatProvider } from "./providers/chat";
import { UserProvider } from "./providers/user";

export const AppRouter = () => {
  return (
    <ChatProvider>
      <UserProvider>
        <Router hook={useWouter}>
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
    </ChatProvider>
  );
};
