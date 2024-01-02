import { gql, useMutation, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { Badge } from "react-bootstrap";
import { CursorFill } from "react-bootstrap-icons";
import { useAuth } from "../../hooks";
import { useFormContext } from "react-hook-form";
import { Property } from "../../pages/PropertyPage/models/types";
import { toast } from "sonner";

const CURSOR_MOVE_MUTATION = gql`
  mutation Mutation(
    $contextId: String
    $username: String
    $positionX: Int
    $positionY: Int
  ) {
    cursorMove(
      contextId: $contextId
      username: $username
      positionX: $positionX
      positionY: $positionY
    )
  }
`;

const CURSOR_MOVE_SUBCRIPTION = gql`
  subscription Subscription {
    cursorMove {
      contextId
      positionX
      positionY
      username
    }
  }
`;

type TCursor = {
  contextId: string;
  username: string;
  positionX: number;
  positionY: number;
};

const Cursor: React.FC = () => {
  const { user } = useAuth();
  const { getValues } = useFormContext<Property>();
  const [updateCursorPosition] = useMutation<string, TCursor>(
    CURSOR_MOVE_MUTATION,
  );
  const { data } = useSubscription<
    {
      cursorMove: TCursor[];
    },
    { currentContext: string }
  >(CURSOR_MOVE_SUBCRIPTION, {
    variables: { currentContext: getValues("id") },
    onError(error) {
      toast.error(JSON.stringify(error));
    },
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!user) return;

      updateCursorPosition({
        variables: {
          contextId: getValues("id"),
          username: user.username,
          positionX: e.clientX,
          positionY: e.clientY,
        },
      });
    };

    document.addEventListener("mousemove", updateMousePosition);

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <div>
      {data?.cursorMove
        .filter(
          (e) =>
            e.contextId === getValues("id") && e.username !== user?.username,
        )
        .map((e) => {
          return (
            <>
              <CursorFill
                className="position-absolute z-2"
                style={{
                  rotate: "-90deg",
                  left: `${e.positionX - 10}px`,
                  top: `${e.positionY - 7}px`,
                }}
              />
              <div
                className="position-absolute z-2"
                style={{
                  left: `${e.positionX}px`,
                  top: `${e.positionY}px`,
                  width: "15px",
                  height: "10px",
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                <Badge
                  bg={e.username === user?.username ? "primary" : "success"}
                >
                  {e.username === user?.username ? "Tu" : e.username}
                </Badge>
              </div>
            </>
          );
        })}
    </div>
  );
};

export default Cursor;
