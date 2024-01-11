import { gql, useMutation, useSubscription } from "@apollo/client";
import { useState } from "react";
import { FieldPath, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "../../../hooks";
import { useLazyCan } from "../../../hooks/useLazyCan";
import { useSeeker } from "../../../hooks/useSeeker";
import {
  Property,
  ReturnTUseInputSubscription,
  TFucused,
  TUseInputSubscriptionParams,
} from "../models/types";
import { useModalInputStore } from "../../../state/useModalInputStore";

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

const CHANGE_INPUT_MUTATION = gql`
  mutation ChangeInput($name: String, $value: String) {
    changeInput(name: $name, value: $value)
  }
`;

const CHANGE_INPUT_SUBSCRIPTION = gql`
  subscription ChangeInput {
    changeInput {
      name
      value
    }
  }
`;

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
  events,
  options,
}: TUseInputSubscriptionParams): ReturnTUseInputSubscription => {
  const { user } = useAuth();
  const { register, setValue, getValues } = useFormContext<Property>();
  const [isDirty, setIsDirty] = useState(false);
  const [
    { username, itsMe, isCurrentInput, isFocused, isCurrentContext },
    setState,
  ] = useState({
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
  );

  const [onChangeMutation] = useMutation<
    string,
    { name: string; value: string }
  >(CHANGE_INPUT_MUTATION);
  useSubscription<{
    changeInput: {
      name: FieldPath<Property>;
      value: string;
    };
  }>(CHANGE_INPUT_SUBSCRIPTION, {
    onData({ data: { data } }) {
      if (data && isCurrentContext) {
        /// @ts-ignore
        setValue(data.changeInput.name, data.changeInput.value);
      }
    },
  });
  const { data, fetchCan } = useLazyCan();
  const canEdit = data[`${getValues("id") ? "UPDATE" : "CREATE"}@PROPERTY`];
  const { setIsAvailableModal } = useSeeker();
  const { openModal, isOpen, setFieldName } = useModalInputStore()
  return {
    username,
    isFocus: isCurrentInput && isFocused && !itsMe && canEdit,
    subscribe: {
      ...rest,
      disabled: isCurrentInput && isFocused && !itsMe,
      readOnly: !canEdit,
      onFocus: async (e) => {
        if (name === 'technicalObservation') {
          setIsAvailableModal(false);
          setFieldName({ fieldName: name })
        }
        if (getValues("id")) {
          handleFocused(true);
        }
        events?.onFocus?.(e);
        console.log({ name, event: "focus" });
        const level = getValues("id") ? "UPDATE" : "CREATE";
        fetchCan({
          variables: {
            can: [{ resource: "PROPERTY", level }],
          },
        });
      },
      onBlur: async (e) => {
        if (!isOpen && name === "technicalObservation") {
          setIsAvailableModal(true)
        }
        if (getValues("id")) {
          handleFocused(false);
        }
        events?.onBlur?.(e);
        onBlur(e);
        if (getValues("id") && isDirty && isCurrentContext) {
          const promise = updateField({
            variables: {
              fieldName: name,
              id: getValues("id"),
              value: getValues(name),
            },
            onCompleted() {
              setIsDirty(false);
            },
          });
          toast.promise(promise, {
            loading: "Actualizando campo",
            success: "Se ha actualizado este campo",
            error: "Ocurrio un error al intentar actualizar este campo",
          });
        }
      },
      onChange: async (e) => {
        if (isCurrentContext) {
          setIsDirty(true);
          onChangeMutation({
            variables: {
              name,
              value: e.target.value,
            },
          });
          events?.onChange?.(e);
          onChange(e);
        }
      },
      onKeyDown: async (e) => {
        if (name !== 'technicalObservation') return
        if (e.ctrlKey) {
          if ((e.key === 'b' || e.key === 'B') || (e.key === 'f' || e.key === 'F')) {
            e.preventDefault();
            openModal()
          }
        }
      },
    },
  };
};
