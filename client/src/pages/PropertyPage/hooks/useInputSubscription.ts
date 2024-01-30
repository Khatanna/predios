import { gql, useMutation, useSubscription } from "@apollo/client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useSeeker } from "../../../hooks/useSeeker";
import {
  Property,
  ReturnTUseInputSubscription,
  TFucused,
  TUseInputSubscriptionParams,
} from "../models/types";
import { useModalInputStore } from "../../../state/useModalInputStore";
import { useAuthStore } from "../../../state/useAuthStore";
import { GET_ALL_PROPERTIES_QUERY } from "../components/PropertyList/PropertyList";
import { usePropertyListStore } from "../state/usePropertyListStore";

const FOCUSED_INPUT_MUTATION = gql`
  mutation FocusInput($contextId: String, $name: String, $isFocused: Boolean) {
    focusInput(contextId: $contextId, name: $name, isFocused: $isFocused)
  }
`;

const FOCUSED_INPUT_SUBSCRIPTION = gql`
  subscription FucusedInput {
    focusedInput {
      contextId
      isFocused
      name
      username
    }
  }
`;

// const CHANGE_INPUT_MUTATION = gql`
//   mutation ChangeInput($name: String, $value: String) {
//     changeInput(name: $name, value: $value)
//   }
// `;

// const CHANGE_INPUT_SUBSCRIPTION = gql`
//   subscription ChangeInput {
//     changeInput {
//       name
//       value
//     }
//   }
// `;

const UPDATE_FIELD_MUTATION = gql`
  mutation UpdateField($id: String, $fieldName: String, $value: String) {
    property: updateField(id: $id, fieldName: $fieldName, value: $value) {
      name
    }
  }
`;

const UPDATE_FIELD_NUMBER_MUTATION = gql`
  mutation UpdateField($id: String, $fieldName: String, $value: Int) {
    property: updateFieldNumber(id: $id, fieldName: $fieldName, value: $value) {
      name
    }
  }
`;

export const useInputSubscription = ({
  name,
  options,
  params,
}: TUseInputSubscriptionParams): ReturnTUseInputSubscription => {
  const { user } = useAuthStore();
  const { limit, page, orderBy, unit, fieldOrder } = usePropertyListStore();
  const { register, getValues } = useFormContext<Property>();
  const [isDirty, setIsDirty] = useState(false);
  const [{ username, itsMe, isCurrentInput, isFocused }, setState] = useState({
    username: "Usuario desconocido",
    itsMe: false,
    isCurrentInput: false,
    isFocused: false,
    isCurrentContext: false,
  });
  useSubscription<{
    focusedInput: {
      contextId: string;
      name: string;
      isFocused: boolean;
      username: string;
    };
  }>(FOCUSED_INPUT_SUBSCRIPTION, {
    onData({ data: { data } }) {
      if (data) {
        const {
          focusedInput: { isFocused, name: nameResponse, username, contextId },
        } = data;
        const isCurrentContext = getValues("id") === contextId;
        setState({
          isFocused: isFocused && isCurrentContext,
          itsMe: username === user?.username,
          isCurrentInput: name === nameResponse && isCurrentContext,
          username,
          isCurrentContext,
        });
      }
    },
    skip: !getValues("id"),
  });

  const [focusedInput] = useMutation<string, TFucused>(FOCUSED_INPUT_MUTATION);
  const { onBlur, onChange, ...rest } = register(name, options);
  const handleFocused = (isFocused: boolean) => {
    focusedInput({
      variables: {
        contextId: getValues("id"),
        isFocused,
        name,
      },
    });
  };
  const [updateField] = useMutation<
    { property: Property },
    { id: string; fieldName: string; value: string | number }
  >(
    options?.valueAsNumber
      ? UPDATE_FIELD_NUMBER_MUTATION
      : UPDATE_FIELD_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_ALL_PROPERTIES_QUERY,
          variables: {
            page,
            limit,
            orderBy,
            unit,
            fieldOrder,
          },
        },
      ],
    },
  );

  const { can } = useAuthStore();
  const canEdit = can(`${getValues("id") ? "UPDATE" : "CREATE"}@PROPERTY`);
  const { setIsAvailableModal } = useSeeker();
  const { openModal, isOpen, setFieldName } = useModalInputStore();
  return {
    username,
    isFocus: isCurrentInput && isFocused && !itsMe && canEdit,
    subscribe: {
      ...rest,
      disabled: isCurrentInput && isFocused && !itsMe,
      readOnly: !canEdit,
      onFocus: async () => {
        if (!canEdit) {
          toast.info("No puede editar este campo");
        }
        if (name === "technicalObservation") {
          setIsAvailableModal(false);
          setFieldName({ fieldName: name });
        }
        if (getValues("id")) {
          handleFocused(true);
        }
        console.log({ name, event: "focus" });
      },
      onBlur: async (e) => {
        if (!isOpen && name === "technicalObservation") {
          setIsAvailableModal(true);
        }

        if (getValues("id")) {
          handleFocused(false);
        }

        if (getValues("id") && isDirty) {
          const promise = updateField({
            variables: {
              fieldName: name,
              id: getValues("id"),
              value: params
                ? `${getValues(name)}:${params}`
                : (getValues(name) as string),
            },
            onCompleted() {
              setIsDirty(false);
            },
          });
          toast.promise(promise, {
            loading: "Actualizando campo",
            success: "Se ha actualizado este campo",
            error: "Ocurrio un error al intentar actualizar este campo",
            finally() {
              onBlur(e);
            },
          });
        }
      },
      onChange: async (e) => {
        if (getValues("id")) {
          setIsDirty(true);
        }
        onChange(e);
      },
      onKeyDown: async (e) => {
        if (name !== "technicalObservation") return;
        if (e.ctrlKey) {
          if (
            e.key === "b" ||
            e.key === "B" ||
            e.key === "f" ||
            e.key === "F"
          ) {
            e.preventDefault();
            openModal();
          }
        }
      },
    },
  };
};
