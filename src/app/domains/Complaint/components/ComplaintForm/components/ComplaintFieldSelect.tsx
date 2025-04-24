import React, { useState } from "react";

interface ComplaintFieldSelectProps {
  selectedItem: string;
  items: { name: string; objectId: string }[];
  setSelectedItem: (value: string) => void;
}

const ComplaintFieldSelect: React.FC<ComplaintFieldSelectProps> = ({
  selectedItem,
  setSelectedItem,
  items,
}) => {
  const [isDropdownVisibile, setIsDropdownVisibile] = useState(false);

  const onDropdownButtonClick = () => setIsDropdownVisibile((prev) => !prev);

  const currentlySelected = selectedItem ? (
    items?.find(({ objectId }) => objectId === selectedItem)?.name
  ) : (
    <span className="text-disabled">Vennligst velg element fra listen</span>
  );

  const onItemSelect = (salonId: string) => () => {
    setSelectedItem?.(salonId);
    setIsDropdownVisibile(false);
  };

  return (
    <div className="custom-select">
      <button className="select-trigger" onClick={onDropdownButtonClick}>
        <div className="selected-option">{currentlySelected}</div>
        <span className="arrow">&#9662;</span>
      </button>
      {isDropdownVisibile ? (
        <div className="select-options">
          {items?.map(({ name, objectId }) => (
            <div
              className={`option${
                objectId === selectedItem ? " selected" : ""
              }`}
              onClick={onItemSelect(objectId)}
            >
              {name}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ComplaintFieldSelect;
