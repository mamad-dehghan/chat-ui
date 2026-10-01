import { useHistoryLockAbility } from "kitty";
import { Route, Router, Switch } from "wouter";
import { ScrollableLayout } from "./layout/scrollable";
import { ContactsPage } from "./pages/contacts";
import { SelectGroupUserPage } from "./pages/group/create";
import { ListPage } from "./pages/list";
import { UserPage } from "./pages/user";
import { ChatPage } from "./modules/chat/list/page";
import { UserProvider } from "./modules/users/provider";

export const AppRouter = () => {
  useHistoryLockAbility();

  return (
    <UserProvider>
      <ScrollableLayout>
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
      </ScrollableLayout>
    </UserProvider>
  );
};
