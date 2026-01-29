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
                        checked={selected === "B01"}
                        onChange={() => onChange("B01")}
                    />
                    <span>Tax Credit</span>
                </label>
                <label className="ncf-radio">
                    <input
                        type="radio"
                        checked={selected === "B02"}
                        onChange={() => onChange("B02")}
                    />
                    <span>Final Consumer</span>
                </label>
                <label className="ncf-radio">
                    <input
                        type="radio"
                        checked={selected === "B15"}
                        onChange={() => onChange("B15")}
                    />
                    <span>Government</span>
                </label>
            </div>
            <div className="ncf-selector-right">
                {selected !== "NONE" && ncfInfo ? (
                    <div className="ncf-range">
                        <div className="text-small">
                            Prefix: <strong>{ncfInfo.prefix}</strong> • Series: <strong>{ncfInfo.series}</strong>
                        </div>
                        <div className="text-small">
                            Range: {ncfInfo.initial} – {ncfInfo.last} · Current: {ncfInfo.current} · Left: {ncfInfo.remaining || (ncfInfo.last - ncfInfo.current + 1)}
                        </div>
                    </div>
                ) : selected !== "NONE" && !ncfInfo ? (
                    <div className="text-small" style={{ color: "#ef4444", fontWeight: 500 }}>
                        ⚠️ No active NCF range for {selected}. Add one in Settings.
                    </div>
                ) : (
                    <div className="text-small">No tax receipt will be assigned.</div>
                )}
            </div>
        </div>
    );
}

export default NcfTypeSelector;
