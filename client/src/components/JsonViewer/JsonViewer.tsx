import JsonView, { JsonViewProps } from "@uiw/react-json-view";

export type JsonViewerProps = {
  value: object;
} & JsonViewProps<object>;

const JsonViewer: React.FC<JsonViewerProps> = ({ value }) => {
  return <JsonView value={JSON.parse(JSON.stringify(value))} collapsed />;
};

export default JsonViewer;
