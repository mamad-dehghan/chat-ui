import { useState } from "react";
import { handleLogin, handleSignin, type LoginUser } from "./api";

const USERS: LoginUser[] = [
  {
    username: "mamad",
    password: "P@ssw0rd",
  },
  {
    username: "ali",
    password: "P@ssw0rd",
  },
  {
    username: "reza",
    password: "P@ssw0rd",
  },
];

export const LoginPage = () => {
  const [user, setUser] = useState<LoginUser>(USERS[0]!);

  return (
    <>
      <select
        onChange={(ev) => {
          const u = USERS.find((u) => u.username === ev.target.value);
          if (u) setUser(u);
        }}
        value={user.username}
      >
        {USERS.map((u) => (
          <option key={u.username} value={u.username}>
            {u.username}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          if (user) handleLogin(user);
        }}
      >
        login
      </button>
      <br />
      <button
        onClick={() => {
          if (user) handleSignin(user);
        }}
      >
        sign in
      </button>
    </>
  );
};
