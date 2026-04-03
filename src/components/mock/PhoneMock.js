import React from "react";

export default function PhoneMock({ imageSrc }) {
  return (
    <div className="phoneWrap">
      <div className="phoneGlow" />
      <div className="phoneCard">
        {imageSrc ? (
          <img src={imageSrc} alt="Preview" className="phoneImg" />
        ) : (
          <div className="phonePlaceholder">
            <div className="phTitle">Preview do grupo</div>
            <div className="phLine" />
            <div className="phLine short" />
            <div className="phLine" />
            <div className="phLine short" />
          </div>
        )}
      </div>
    </div>
  );
}
