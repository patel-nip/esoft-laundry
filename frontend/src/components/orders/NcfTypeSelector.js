import React from "react";

function NcfTypeSelector({ selected, onChange, ncfInfo }) {
    return (
        <div className="ncf-selector">
            <div className="ncf-selector-left">
                <span className="ncf-selector-label">Tax receipt (NCF):</span>
                <label className="ncf-radio">
                    <input
                        type="radio"
                        checked={selected === "NONE"}
                        onChange={() => onChange("NONE")}
                    />
                    <span>No</span>
                </label>
                <label className="ncf-radio">
                    <input
                        type="radio"
                        checked={selected === "CREDIT"}
                        onChange={() => onChange("CREDIT")}
                    />
                    <span>Tax Credit</span>
                </label>
                <label className="ncf-radio">
                    <input
                        type="radio"
                        checked={selected === "FINAL"}
                        onChange={() => onChange("FINAL")}
                    />
                    <span>Final Consumer</span>
                </label>
                <label className="ncf-radio">
                    <input
                        type="radio"
                        checked={selected === "GOV"}
                        onChange={() => onChange("GOV")}
                    />
                    <span>Government</span>
                </label>
            </div>
            <div className="ncf-selector-right">
                {ncfInfo ? (
                    <div className="ncf-range">
                        <div className="text-small">
                            Prefix: <strong>{ncfInfo.prefix}</strong>
                        </div>
                        <div className="text-small">
                            Range: {ncfInfo.initial} – {ncfInfo.last} · Used: {ncfInfo.current}
                        </div>
                    </div>
                ) : (
                    <div className="text-small">No tax receipt will be assigned.</div>
                )}
            </div>
        </div>
    );
}

export default NcfTypeSelector;
