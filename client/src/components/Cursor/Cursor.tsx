import { gql, useMutation, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { Badge } from "react-bootstrap";
import { CursorFill } from "react-bootstrap-icons";
import { useAuth } from "../../hooks";

export type CursorProps = {
  // types...
};

const CURSOR_MOVE_MUTATION = gql`
  mutation Mutation($username: String, $positionX: Int, $positionY: Int) {
    cursorMove(
      username: $username
      positionX: $positionX
      positionY: $positionY
    )
  }
`;

const CURSOR_MOVE_SUBCRIPTION = gql`
  subscription Subscription {
    cursorMove {
      positionX
      positionY
      username
    }
  }
`;
const Cursor: React.FC<CursorProps> = ({}) => {
  const { user } = useAuth();
  const [updateCursorPosition] = useMutation<
    string,
    { username: string; positionX: number; positionY: number }
  >(CURSOR_MOVE_MUTATION);
  const { data } = useSubscription<{
    cursorMove: { username: string; positionX: number; positionY: number };
  }>(CURSOR_MOVE_SUBCRIPTION);

  const updateMousePosition = (e: MouseEvent) => {
    if (!user) return;

    updateCursorPosition({
      variables: {
        username: user.username,
        positionX: e.clientX,
        positionY: e.clientY,
      },
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", updateMousePosition);

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  const itsYou = data?.cursorMove.username === user?.username;
  const username = itsYou ? "Tu" : data?.cursorMove.username;
  return (
    <div>
      {!itsYou && data && (
        <>
          <CursorFill
            className="position-absolute z-3"
            style={{
              rotate: "-90deg",
              left: `${data.cursorMove.positionX - 10}px`,
              top: `${data.cursorMove.positionY - 7}px`,
            }}
          />
          <div
            className="position-absolute z-2"
            style={{
              left: `${data.cursorMove.positionX}px`,
              top: `${data.cursorMove.positionY}px`,
              width: "15px",
              height: "10px",
              color: "green",
              fontWeight: "bold",
            }}
          >
            <Badge bg={"success"}>{username}</Badge>
          </div>
        </>
      )}
    </div>
  );
};

export default Cursor;
