import React from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

export default React.memo(function DraggableComponent(props: any) {
  const storedPosition = JSON.parse(localStorage.getItem("position") as string);
  const [position, setPosition] = React.useState(
    storedPosition ? storedPosition : { x: 0, y: 0 }
  );

  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    const { x, y } = data;
    setPosition({ x, y });
  };

  React.useEffect(() => {
    localStorage.setItem("position", JSON.stringify(position));
  }, [position]);

  return (
    <Draggable onStop={handleStop} defaultPosition={position}>
      {props.children}
    </Draggable>
  );
});
