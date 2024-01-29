"use client";
import React, { useCallback, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useSettingsStore } from "../../state/useSettingsStore";
import { Avatar } from "../../components/Avatar";
import { useAuthStore } from "../../state/useAuthStore";
import { Button } from "../../components/Button";
import { ArrowClockwise } from "react-bootstrap-icons";
import { FixedSizeGrid } from "react-window";
import * as Icons from "react-bootstrap-icons";
import { toast } from "sonner";
import { buildFullName } from "../UserPage/utils/buildFullName";
const icons = Object.keys(Icons);

const NUM_COLUMNS = 6;
const IconGrid = ({
  icons,
  color,
  showName,
}: {
  icons: string[];
  color: string;
  showName: (iconName: string) => void;
}) => {
  const GridItem = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * NUM_COLUMNS + columnIndex;
    if (index >= icons.length) return null;

    const iconName = icons[index];
    const Icon = Icons[iconName as keyof typeof Icons];

    return (
      <div
        style={style}
        className="border p-3 d-flex justify-content-center flex-column align-items-center"
        role="button"
        onClick={() => showName(iconName)}
      >
        <Icon fontSize={65} color={color} />
        <div
          style={{ fontSize: 11, width: 65, color: color }}
          className="text-truncate text-center mt-2"
        >
          {iconName}
        </div>
      </div>
    );
  };
  return (
    <FixedSizeGrid
      height={350}
      width={675}
      columnCount={NUM_COLUMNS}
      rowCount={Math.ceil(icons.length / NUM_COLUMNS)}
      columnWidth={665 / NUM_COLUMNS}
      rowHeight={120}
      style={{
        overflowX: "hidden",
        overflowY: "scroll",
        scrollbarWidth: "none",
        scrollbarColor: "black transparent",
      }}
    >
      {GridItem}
    </FixedSizeGrid>
  );
};
const ConfigurationPage: React.FC = () => {
  const { user } = useAuthStore();
  const { sizeOfAvatar, updateConfig, resetConfig } = useSettingsStore();
  const [iconName, setIconName] = useState("");
  const [color, setColor] = useState("black");
  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({
      sizeOfAvatar: Number(value),
    });
  };

  const handleChangeIconName = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setIconName(value);
  };

  const handleSetIconColor = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setColor(value);
    },
    [],
  );
  const showName = useCallback((name: string) => {
    toast.info(name);
  }, []);

  const handleResetSizeOfAvatar = () => {
    resetConfig();
  };
  return (
    <Row>
      <Col xs={6} className="mx-auto">
        <Form.Label>Tamaño del icono de perfil</Form.Label>
        <div className="d-flex justify-content-center my-2 flex-column align-items-center">
          <Avatar sizing={sizeOfAvatar} letter={user?.username} />
          {`${sizeOfAvatar}px`}
        </div>
        <Form.Range
          value={sizeOfAvatar}
          onChange={handleChange}
          min={20}
          max={60}
        />
        <Form.Label>Nombres</Form.Label>
        <Form.Control value={user?.names} />
        <Form.Label>Apellido paterno:</Form.Label>
        <Form.Control value={user?.firstLastName} />
        <Form.Label>Apellido materno:</Form.Label>
        <Form.Control value={user?.secondLastName} />
        <div className="d-flex flex-row gap-2 my-2">
          <Form.Control
            size="sm"
            placeholder="Buscar icono"
            value={iconName}
            onChange={handleChangeIconName}
          />
          <Form.Control
            size="sm"
            placeholder="Color"
            type="color"
            defaultValue="#000"
            value={color}
            onChange={handleSetIconColor}
          />
        </div>
        <div className="my-2">
          <IconGrid
            icons={icons.filter((i) =>
              i.toLowerCase().includes(iconName.toLowerCase()),
            )}
            color={color}
            showName={showName}
          />
        </div>
        <Button
          size="sm"
          onClick={handleResetSizeOfAvatar}
          leading={<ArrowClockwise fontSize={20} />}
        >
          Reestablecer configuración
        </Button>
      </Col>
    </Row>
  );
};

export default ConfigurationPage;
