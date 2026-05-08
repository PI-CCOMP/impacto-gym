import { Outlet } from "react-router-dom";
import { Wrapper } from "../components/Wrapper";

export function AppLayout() {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
}
