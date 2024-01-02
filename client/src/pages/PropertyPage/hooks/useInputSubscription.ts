import { gql, useMutation, useSubscription } from "@apollo/client";
import { useState } from "react";
import { FieldPath, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "../../../hooks";
import {
  Property,
  ReturnTUseInputSubscription,
  TFucused,
  TUseInputSubscriptionParams,
} from "../models/types";

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
    { id: string; fieldName: string; value: string }
  >(UPDATE_FIELD_MUTATION, {
    onError() {
      toast.error("Ocurrio un error al intentar actualizar este campo");
    },
  });

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
        setValue(data.changeInput.name, data.changeInput.value);
      }
    },
  });

  return {
    propertyExists: !!getValues("id"),
    username,
    isCurrentInput,
    isCurrentContext,
    itsMe,
    isFocused,
    isSelected: isCurrentInput && isFocused && !itsMe,
    subscribe: {
      ...rest,
      onFocus: (e) => {
        if (getValues("id")) {
          handleFocused(true);
        }

        events?.onFocus?.(e);
      },
      onBlur: (e) => {
        if (getValues("id")) {
          handleFocused(false);
        }
        events?.onBlur?.(e);
        onBlur(e);
        if (getValues("id") && isDirty && isCurrentContext) {
          updateField({
            variables: {
              fieldName: name,
              id: getValues("id"),
              value: getValues(name),
            },
          });
        }
      },
      onChange: (e) => {
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
    },
  };
};
