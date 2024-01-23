"use client";
import React from "react";
import { Tooltip } from "../../../../components/Tooltip";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import { Property } from "../../models/types";
import {
  GET_SUBSCRIPTIONS_OF_USER,
  useFetchSubscriptions,
} from "../../hooks/useFetchSubscriptions";

const SUBSCRIBE_MUTATION = gql`
  mutation Subscribe($propertyId: String) {
    subscribe(propertyId: $propertyId)
  }
`;

const UNSUBSCRIBE_MUTATION = gql`
  mutation Subscribe($propertyId: String) {
    unsubscribe(propertyId: $propertyId)
  }
`;

const showDisclaimer = () => {
  return Swal.fire({
    icon: "question",
    title: "¿Desea suscribirse a los cambios de este predio?",
    text: "Recibira notificaciones cuando se realize una actualización o cambio en este predio",
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonColor: "red",
    confirmButtonColor: "green",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Suscribirse",
  });
};

const ButtonSubscribe: React.FC = () => {
  const { getValues } = useFormContext<Property>();
  const { data } = useFetchSubscriptions();
  const isSubscribe = data?.subscriptions.some(
    (subscription) => subscription.property.id === getValues("id"),
  );
  const [subscribeMutation] = useMutation<
    { subscribe: boolean },
    { propertyId: string }
  >(SUBSCRIBE_MUTATION, {
    refetchQueries: [
      {
        query: GET_SUBSCRIPTIONS_OF_USER,
      },
    ],
  });
  const [unsubscribeMutation] = useMutation<
    { unsubscribe: boolean },
    { propertyId: string }
  >(UNSUBSCRIBE_MUTATION, {
    refetchQueries: [
      {
        query: GET_SUBSCRIPTIONS_OF_USER,
      },
    ],
  });
  const subscribe = () => {
    toast.promise(
      subscribeMutation({
        variables: {
          propertyId: getValues("id"),
        },
      }),
      {
        loading: "Suscribiendose",
        error: (e) => e?.message ?? "Ocurrio un error, intentelo más tarde",
        success: "Ahora esta suscrito a los cambios de este predio",
      },
    );
  };

  const unsubscribe = () => {
    toast.promise(
      unsubscribeMutation({
        variables: {
          propertyId: getValues("id"),
        },
      }),
      {
        loading: "Desuscribiendo",
        error: (e) => e?.message ?? "Ocurrio un error, intentelo más tarde",
        success: "Ahora esta desuscrito a los cambios de este predio",
      },
    );
  };

  const handleSubscribe = () => {
    if (!isSubscribe) {
      showDisclaimer().then(({ isConfirmed }) => {
        if (isConfirmed) {
          subscribe();
        }
      });
    } else {
      unsubscribe();
    }
  };
  const Eye = isSubscribe ? EyeSlashFill : EyeFill;
  return (
    <div className="position-absolute top-0 end-50" style={{ width: "1px" }}>
      <Tooltip
        label={
          isSubscribe
            ? "Desuscribirse a los cambios de este predio"
            : "Suscribirse a los cambios de este predio"
        }
      >
        <Eye
          color="#3c8bd4"
          role="button"
          fontSize={24}
          onClick={handleSubscribe}
        />
      </Tooltip>
    </div>
  );
};

export default ButtonSubscribe;
